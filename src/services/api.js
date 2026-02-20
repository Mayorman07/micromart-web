import axios from "axios";

// Create an instance with your base backend URL
const api = axios.create({
    baseURL: "http://127.0.0.1:7082"
});

// REQUEST INTERCEPTOR: Automatically add the Access Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR: Handle Expired Tokens (401)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't retried this specific request yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");
                
                // Call your backend refresh endpoint
                const rs = await axios.post("http://127.0.0.1:7082/users/users/refresh-token", {
                    refreshToken: refreshToken
                });

                // Get new token from your TokenRefreshResponse
                const { accessToken } = rs.data; 
                localStorage.setItem("token", accessToken);

                // Update header and retry the original request
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, clear storage and send to login
                localStorage.clear();
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;