import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";

export const useSessionTimeout = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [warningShown, setWarningShown] = useState(false);

    useEffect(() => {
        const checkSession = () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                // Decode JWT payload (middle part)
                const payload = JSON.parse(atob(token.split('.')[1]));
                const expiryTime = payload.exp * 1000; // Convert to milliseconds
                const currentTime = Date.now();
                const timeLeft = expiryTime - currentTime;

                // Warning threshold: 2 minutes (120,000 ms)
                if (timeLeft <= 120000 && timeLeft > 0 && !warningShown) {
                    showToast("Security Alert: Session expiring in 120s. Please save your progress.", "error");
                    setWarningShown(true);
                }

                // Absolute expiration
                if (timeLeft <= 0) {
                    localStorage.clear();
                    showToast("Session Expired: Re-authentication required.", "error");
                    navigate("/login");
                }
            } catch (err) {
                console.error("Session monitor error:", err);
            }
        };

        // Check every 10 seconds
        const interval = setInterval(checkSession, 10000);
        return () => clearInterval(interval);
    }, [navigate, showToast, warningShown]);

    return null;
};