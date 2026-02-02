// src/pages/Auth/ForgotPassword.jsx
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Don't forget Link!
import Snowfall from "../../components/Snowfall"; 
// 1. Import the new CSS Module
import styles from "./Auth.module.css"; 

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle"); 
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMessage("");

        try {
            await axios.post("http://127.0.0.1:7082/users/password-reset/request", { email });
            setStatus("success");
        } catch (error) {
            console.error("Request Failed", error);
            setStatus("error");
            setErrorMessage(error.response?.data?.message || "Something went wrong. Try again.");
        }
    };

    // ✅ Success State
    if (status === "success") {
        return (
            <div className={styles.authContainer}>
                <Snowfall />
                <div className={styles.authCard}>
                    <div className={styles.iconCircle} style={{ background: "rgba(40, 167, 69, 0.1)" }}>
                        <span style={{ fontSize: "30px" }}>📧</span>
                    </div>
                    <h2 className={styles.title}>Check your mail</h2>
                    <p className={styles.subtitle}>
                        We have sent a password reset link to <br/> <strong>{email}</strong>
                    </p>
                    <div className={styles.successMessage}>
                        Did not receive the email? Check your spam folder or try again.
                    </div>
                    <div className={styles.footerText}>
                        <Link to="/login" className={styles.linkSpan}>Back to Login</Link>
                    </div>
                </div>
            </div>
        );
    }

    // 📝 Request Form
    return (
        <div className={styles.authContainer}>
            <Snowfall />
            <div className={styles.authCard} style={{ maxWidth: "450px" }}>
                
                <div className={styles.iconCircle}>
                    <svg style={{ color: "#0072ff", width: "35px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                    </svg>
                </div>

                <h2 className={styles.title}>Forgot Password?</h2>
                <p className={styles.subtitle}>No worries, we'll send you reset instructions.</p>

                <form onSubmit={handleSubmit} className={styles.formGroup}>
                    <div>
                        <label style={{ display: "block", marginBottom: "5px", color: "#333", fontWeight: "600", fontSize: "14px" }}>Email Address</label>
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                            className={styles.inputField}
                        />
                    </div>

                    {status === "error" && (
                        <p className={styles.errorMsg}>⚠️ {errorMessage}</p>
                    )}

                    <button 
                        type="submit" 
                        className={styles.submitBtn}
                        disabled={status === "loading"}
                    >
                        {status === "loading" ? "Sending Link..." : "Reset Password"}
                    </button>
                </form>

                <div className={styles.footerText}>
                    <Link to="/login" className={styles.linkSpan}>
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;