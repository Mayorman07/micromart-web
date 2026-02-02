import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Snowfall from "../../components/Snowfall"; 
import styles from "./Auth.module.css"; 

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    const [passwords, setPasswords] = useState({ newPassword: "", confirmPassword: "" });
    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Regex Validations
    const validations = {
        hasLower: /[a-z]/.test(passwords.newPassword),
        hasUpper: /[A-Z]/.test(passwords.newPassword),
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(passwords.newPassword),
        hasLength: passwords.newPassword.length >= 8
    };

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
        if (status === "error") {
            setStatus("idle");
            setMessage("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Block if requirements not met
        if (!validations.hasLower || !validations.hasUpper || !validations.hasSpecial || !validations.hasLength) {
            setMessage("Password does not meet complexity requirements.");
            setStatus("error");
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            setMessage("Passwords do not match!");
            setStatus("error");
            return;
        }

        setStatus("loading");

        try {
            await axios.post("http://127.0.0.1:7082/users/password-reset/reset", {
                token: token,
                newPassword: passwords.newPassword
            });
            setStatus("success");
        } catch (error) {
            setStatus("error");
            setMessage(error.response?.data?.message || "Link expired or invalid.");
        }
    };

    // ✅ Success State
    if (status === "success") {
        return (
            <div className={styles.authContainer}>
                <Snowfall />
                <div className={styles.authCard}>
                    <div className={styles.iconCircle} style={{ background: "rgba(40, 167, 69, 0.1)" }}>
                        <span style={{ fontSize: "30px" }}>✅</span>
                    </div>
                    <h2 className={styles.title}>Password Reset!</h2>
                    <p className={styles.subtitle}>You can now login with your new password.</p>
                    <button className={styles.submitBtn} onClick={() => navigate("/login")}>
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    // 📝 Reset Form State
    return (
        <div className={styles.authContainer}>
            <Snowfall />
            
            <div className={styles.authCard} style={{ maxWidth: "500px" }}>
                <h2 className={styles.title}>Reset your password</h2>
                
                <form onSubmit={handleSubmit} className={styles.formGroup} style={{ marginTop: "20px" }}>
                    
                    {/* New Password with Eye Icon */}
                    <div className={styles.passwordWrapper}>
                        <label style={labelStyle}>New password</label>
                        <input 
                            name="newPassword" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Enter new password"
                            onChange={handleChange}
                            required
                            className={styles.inputField} 
                            style={{ paddingRight: "40px" }}
                        />
                         <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className={styles.eyeIcon}
                            title="Show password"
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                    </div>

                    {/* Dynamic Validation Checklist */}
                    <div style={validationGridStyle}>
                        <ValidationItem isValid={validations.hasLower} text="One lowercase character" />
                        <ValidationItem isValid={validations.hasSpecial} text="One special character" />
                        <ValidationItem isValid={validations.hasUpper} text="One uppercase character" />
                        <ValidationItem isValid={validations.hasLength} text="8 characters minimum" />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label style={labelStyle}>Confirm new password</label>
                        <input 
                            name="confirmPassword" 
                            type="password" 
                            placeholder="Confirm new password"
                            onChange={handleChange}
                            required
                            className={styles.inputField}
                        />
                    </div>

                    {status === "error" && (
                        <p className={styles.errorMsg}>
                            ⚠️ {message}
                        </p>
                    )}

                    <button 
                        type="submit" 
                        className={styles.submitBtn} 
                        disabled={status === "loading"}
                    >
                        {status === "loading" ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

// Helper Component for checklist
const ValidationItem = ({ isValid, text }) => (
    <div style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: "6px",
        color: isValid ? "#16a34a" : "#64748b", 
        transition: "all 0.3s ease",
        fontWeight: isValid ? "600" : "normal"
    }}>
        <span style={{ fontSize: "14px" }}>{isValid ? "✓" : "•"}</span>
        {text}
    </div>
);

// Small inline styles for things specific to ONLY this component
const labelStyle = { 
    fontWeight: "600", 
    fontSize: "14px", 
    color: "#374151", 
    marginBottom: "5px", 
    display: "block",
    textAlign: "left"
};

const validationGridStyle = { 
    fontSize: "12px", 
    color: "#64748b", 
    marginBottom: "15px", 
    display: "grid", 
    gridTemplateColumns: "1fr 1fr", 
    gap: "8px",
    textAlign: "left"
};

export default ResetPassword;