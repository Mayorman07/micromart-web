import axios from "axios";

const GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL || "http://127.0.0.1:7082";

const api = axios.create({
    baseURL: GATEWAY_URL
});

// Logic: Global lock variables
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // FIX: Only catch 401. Catching 403 here creates an infinite loop.
        if (error.response?.status === 401 && !originalRequest._retry) {
            
            if (isRefreshing) {
                // If a refresh is already in progress, add this request to a queue
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return api(originalRequest);
                }).catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            return new Promise((resolve, reject) => {
                const refreshToken = localStorage.getItem("refreshToken");
                
                // Use a standard axios instance to avoid interceptor interference
                axios.post(`${GATEWAY_URL}/users/users/refresh-token`, { refreshToken })
                    .then(({ data }) => {
                        const { accessToken, refreshToken: newRefreshToken } = data;
                        
                        localStorage.setItem("token", accessToken);
                        if (newRefreshToken) localStorage.setItem("refreshToken", newRefreshToken);

                        api.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
                        originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;
                        
                        processQueue(null, accessToken);
                        resolve(api(originalRequest));
                    })
                    .catch((err) => {
                        processQueue(err, null);
                        localStorage.clear();
                        window.location.href = "/login";
                        reject(err);
                    })
                    .finally(() => {
                        isRefreshing = false;
                    });
            });
        }

        return Promise.reject(error);
    }
);

export default api;