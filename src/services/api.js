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

// RESPONSE INTERCEPTOR: Handle Expired and Tokens and Unauthorized Permissions(401/403)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 🎯 UPDATE HERE: Catch BOTH 401 and 403 errors
        if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");
                
                // If there's no refresh token, don't even try, just log them out
                if (!refreshToken) {
                    localStorage.clear();
                    window.location.href = "/login";
                    return Promise.reject(error);
                }
                
                const rs = await axios.post("http://127.0.0.1:7082/users/users/refresh-token", {
                    refreshToken: refreshToken
                });

                const { accessToken } = rs.data; 
                localStorage.setItem("token", accessToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.clear();
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;