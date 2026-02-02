import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Snowfall from "../../components/Snowfall"; 
// 1. Import the new CSS Module
import styles from "./Auth.module.css"; 

const Login = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState("idle");
    const [errorMessage, setErrorMessage] = useState("");
    
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMessage("");

        try {
            const response = await axios.post(
                "http://127.0.0.1:7082/users/users/login", 
                formData
            );

            const token = response.data.token;
            const userId = response.data.userId;

            if (!token) throw new Error("Token missing");

            localStorage.setItem("token", token);
            localStorage.setItem("userId", userId);

            setStatus("success");
            
            setTimeout(() => {
                navigate("/dashboard");
            }, 1000);

        } catch (error) {
            console.error("Login Failed", error);
            setStatus("error");
            setErrorMessage("Invalid email or password.");
        }
    };

    return (
        // Use styles.authContainer instead of "verify-container"
        <div className={styles.authContainer}>
            <Snowfall />

            <div className={styles.authCard}>
                
                {/* 🔐 Header Icon */}
                <div className={styles.iconCircle}>
                    <svg style={{ color: "#0072ff", width: "35px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                </div>

                <h2 className={styles.title}>Welcome Back</h2>
                <p className={styles.subtitle}>Enter your login details to access Micromart.</p>
                
                <form onSubmit={handleSubmit} className={styles.formGroup}>
                    
                    <div>
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required 
                            placeholder="Email Address"
                            className={styles.inputField} 
                        />
                    </div>

                    <div>
                        <input 
                            type="password" 
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required 
                            placeholder="Password"
                            className={styles.inputField}
                        />
                    </div>

                    {/* Forgot Password Link */}
                    <div>
                        <span 
                            onClick={() => navigate("/forgot-password")}
                            className={styles.forgotLink}
                        >
                            Forgot Password?
                        </span>
                    </div>

                    {status === "error" && (
                        <p className={styles.errorMsg}>
                            ⚠️ {errorMessage}
                        </p>
                    )}

                    <button 
                        type="submit" 
                        disabled={status === "loading" || status === "success"}
                        className={styles.submitBtn}
                    >
                        {status === "loading" ? "Authenticating..." : status === "success" ? "Success! 🔓" : "Sign In"}
                    </button>
                </form>

                <div className={styles.footerText}>
                    New to Micromart?{" "}
                    <span 
                        onClick={() => navigate("/signup")} 
                        className={styles.linkSpan}
                    >
                        Create an account
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Login;