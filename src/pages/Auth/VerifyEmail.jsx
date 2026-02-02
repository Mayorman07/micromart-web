// src/pages/Auth/VerifyEmail.jsx
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Snowfall from "../../components/Snowfall"; 
// 1. Import the new CSS Module
import styles from "./Auth.module.css"; 

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");
    const [status, setStatus] = useState("verifying");
    const hasCalledAPI = useRef(false);

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
        // Use styles.authContainer to get the gradient back
        <div className={styles.authContainer}>
            <Snowfall />

            <div className={styles.authCard} style={{ maxWidth: "450px" }}>
                
                {/* ⏳ LOADING STATE */}
                {status === "verifying" && (
                    <>
                        <div className={styles.iconCircle} style={{ animation: "pulse 2s infinite" }}>
                            <span style={{ fontSize: "30px" }}>⏳</span>
                        </div>
                        <h2 className={styles.title}>Verifying...</h2>
                        <p className={styles.subtitle}>Securely connecting to Micromart servers.</p>
                    </>
                )}

                {/* ✅ SUCCESS STATE */}
                {status === "success" && (
                    <>
                        <div className={styles.iconCircle} style={{ background: "rgba(40, 167, 69, 0.1)" }}>
                            <svg style={{ color: "#16a34a", width: "40px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h2 className={styles.title}>Email Verified!</h2>
                        <p className={styles.subtitle}>
                            Welcome to the <strong>MicroMart</strong> family. <br/>
                            Your account is now active and ready.
                        </p>
                        <button className={styles.submitBtn} onClick={() => navigate("/login")}>
                            Proceed to Login
                        </button>
                    </>
                )}

                {/* ❌ ERROR STATE */}
                {status === "error" && (
                    <>
                        <div className={styles.iconCircle} style={{ background: "#fee2e2" }}>
                             <svg style={{ color: "#dc2626", width: "40px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </div>
                        <h2 className={styles.title} style={{ color: "#dc2626" }}>Link Expired</h2>
                        <p className={styles.subtitle}>
                            This verification link is invalid or has already been used.
                        </p>
                        <button 
                            className={styles.submitBtn} 
                            style={{ background: "#374151" }} 
                            onClick={() => navigate("/login")}
                        >
                            Back to Login
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;