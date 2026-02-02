import { useEffect, useState, useRef, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
// 1. Import module
import styles from "./Auth.module.css"; 

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");
    const [status, setStatus] = useState("verifying");
    const hasCalledAPI = useRef(false);

    const snowflakes = useMemo(() => {
        return [...Array(50)].map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            size: Math.random() * 4 + 2,
            duration: Math.random() * 5 + 5,
            delay: Math.random() * 5,
            opacity: Math.random() * 0.5 + 0.3 
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
        // 2. Use styles.authContainer (Blue Gradient)
        <div className={styles.authContainer}>
            
            {/* 3. Use styles.snowflake */}
            {snowflakes.map((flake) => (
                <div 
                    key={flake.id}
                    className={styles.snowflake} 
                    style={{
                        left: `${flake.left}vw`,
                        width: `${flake.size}px`,
                        height: `${flake.size}px`,
                        animation: `snowfall ${flake.duration}s linear infinite`,
                        animationDelay: `-${flake.delay}s`, 
                        opacity: flake.opacity
                    }}
                />
            ))}

            <div className={styles.authCard}>
                {status === "verifying" && (
                    <>
                        <div className={styles.loader}></div>
                        <h2 className={styles.title}>Verifying...</h2>
                        <p className={styles.subtitle}>Securely connecting to Micromart servers.</p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className={styles.iconCircle} style={{background: "rgba(255,255,255,0.9)"}}>
                            <svg style={{width:"40px", color:"#16a34a"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h2 className={styles.title}>Email Verified!</h2>
                        <p className={styles.subtitle}>
                            Welcome to the <strong>Micromart</strong> family.
                        </p>
                        <button className={styles.submitBtn} onClick={() => navigate("/login")}>
                            Proceed to Login
                        </button>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className={styles.iconCircle} style={{background: "#fee2e2"}}>
                             <svg style={{color: "#dc2626", width:"40px"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </div>
                        <h2 className={styles.title} style={{color: "#dc2626"}}>Link Expired</h2>
                        <p className={styles.subtitle}>
                            This verification link is invalid.
                        </p>
                        <button className={styles.submitBtn} style={{background: "#374151"}} onClick={() => navigate("/login")}>
                            Back to Login
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;