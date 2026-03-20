import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:7082",
    headers: {
        "Content-Type": "application/json"
    }
});

// REQUEST INTERCEPTOR: Inject current Access Token
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

// RESPONSE INTERCEPTOR: Handle Token Rotation
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        /**
         * Logic: Only attempt rotation on 401 (Unauthorized).
         * 403 (Forbidden) should be handled by your UI/Permissions logic, 
         * as refreshing a token won't fix lack of access rights.
         */
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const currentRefreshToken = localStorage.getItem("refreshToken");
                if (!currentRefreshToken) throw new Error("Missing Refresh Registry");

                console.warn("Access Token Expired: Initializing rotation registry...");

                // Use a clean axios instance for the refresh call to avoid interceptor interference
                const response = await axios.post(`${api.defaults.baseURL}/users/users/refresh-token`, {
                    refreshToken: currentRefreshToken
                });

                const { accessToken, refreshToken: newRefreshToken } = response.data;

                if (accessToken) {
                    // Update Local Storage Registry
                    localStorage.setItem("token", accessToken);
                    if (newRefreshToken) {
                        localStorage.setItem("refreshToken", newRefreshToken);
                    }

                    console.log("Registry Synchronized: New token injected.");

                    // Re-inject the new token into the original request headers
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    
                    // Re-dispatch the original request using the same 'api' instance
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.error("Session Integrity Compromised: Forcing re-authentication.");
                
                // Clear all identity data and redirect
                localStorage.clear();
                window.location.href = "/login?session=expired";
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;