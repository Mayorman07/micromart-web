import { useEffect, useState, useRef, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./VerifyEmail.css";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");
    const [status, setStatus] = useState("verifying");
    const hasCalledAPI = useRef(false);

    // ❄️ GENERATE SNOWFLAKES (Memorized so they don't flicker)
    const snowflakes = useMemo(() => {
        return [...Array(50)].map((_, i) => ({
            id: i,
            left: Math.random() * 100,      // Random horizontal position (0-100%)
            size: Math.random() * 4 + 2,    // Random size (2px to 6px)
            duration: Math.random() * 5 + 5,// Random speed (5s to 10s)
            delay: Math.random() * 5,       // Random delay start
            opacity: Math.random() * 0.5 + 0.3 // Random transparency
        }));
    }, []);

    useEffect(() => {
        if (!token) {
            setStatus("error");
            return;
        }

        if (hasCalledAPI.current) return;
        hasCalledAPI.current = true;

        axios.get(`http://127.0.0.1:7082/users/api/v1/auth/verify?token=${token}`)
            .then(() => {
                setTimeout(() => setStatus("success"), 800);
            })
            .catch((error) => {
                console.error("Verification failed", error);
                setStatus("error");
            });
    }, [token]);

    return (
        <div className="verify-container">
            
            {/* ❄️ RENDER SNOWFLAKES */}
            {snowflakes.map((flake) => (
                <div 
                    key={flake.id}
                    className="snowflake"
                    style={{
                        left: `${flake.left}vw`,
                        width: `${flake.size}px`,
                        height: `${flake.size}px`,
                        animation: `snowfall ${flake.duration}s linear infinite`,
                        animationDelay: `-${flake.delay}s`, // Negative delay makes them start immediately
                        opacity: flake.opacity
                    }}
                />
            ))}

            <div className="verify-card">
                {/* ⏳ LOADING STATE */}
                {status === "verifying" && (
                    <>
                        <div className="loader"></div>
                        <h2 className="title">Verifying...</h2>
                        <p className="subtitle">Securely connecting to Micromart servers.</p>
                    </>
                )}

                {/* ✅ SUCCESS STATE */}
                {status === "success" && (
                    <>
                        <div className="icon-circle">
                            <svg className="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h2 className="title">Email Verified!</h2>
                        <p className="subtitle">
                            Welcome to the <strong>Micromart</strong> family. <br/>
                            Your account is now active and ready.
                        </p>
                        <button className="login-btn" onClick={() => navigate("/login")}>
                            Proceed to Login
                        </button>
                    </>
                )}

                {/* ❌ ERROR STATE */}
                {status === "error" && (
                    <>
                        <div className="icon-circle" style={{background: "#fee2e2"}}>
                             <svg className="icon-svg" style={{color: "#dc2626"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </div>
                        <h2 className="title" style={{color: "#dc2626"}}>Link Expired</h2>
                        <p className="subtitle">
                            This verification link is invalid or has already been used.
                        </p>
                        <button className="login-btn" style={{background: "#374151"}} onClick={() => navigate("/login")}>
                            Back to Login
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;