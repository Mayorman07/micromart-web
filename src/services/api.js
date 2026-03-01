import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:7082"
});

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

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        const isAuthError = error.response?.status === 401 || error.response?.status === 403;

        if (isAuthError && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");
                
                if (!refreshToken) throw new Error("No refresh token found");
                
                console.log(" 401 Unauthorized: Attempting silent hardware re-authorization...");

                const rs = await axios.post("http://127.0.0.1:7082/users/users/refresh-token", {
                    refreshToken: refreshToken
                });

                const { token, refreshToken: newRefreshToken } = rs.data;

                if (token) {
                    localStorage.setItem("token", token);
                    if (newRefreshToken) {
                        localStorage.setItem("refreshToken", newRefreshToken);
                    }

                    console.log(" Re-authorization successful. Retrying original request...");

                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.error(" Session fully expired. Purging local registry data.");
                localStorage.clear();
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;