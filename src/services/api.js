import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:7082"
});

// REQUEST INTERCEPTOR
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

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 🎯 Catching 401/403 (Standard) OR 500 (If your GlobalExceptionHandler sends 500 on JWT expiry)
        const isAuthError = error.response?.status === 401 || error.response?.status === 403;
        const isExpiredError = error.response?.status === 500 && error.response?.data?.message?.includes("expired");

        if ((isAuthError || isExpiredError) && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");
                
                if (!refreshToken) {
                    throw new Error("No refresh token available");
                }
                
                // Call Users Microservice refresh endpoint
                const rs = await axios.post("http://127.0.0.1:7082/users/users/refresh-token", {
                    refreshToken: refreshToken
                });

                // 💎 Sync with your Backend Response structure:
                // If your backend returns { accessToken: "..." } or { token: "..." }
                const newAccessToken = rs.data.accessToken || rs.data.token; 
                
                if (newAccessToken) {
                    localStorage.setItem("token", newAccessToken);
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    
                    // Re-run the original failed request (e.g., the Cart Update)
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.error("Token refresh failed, redirecting to login...");
                localStorage.clear();
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;