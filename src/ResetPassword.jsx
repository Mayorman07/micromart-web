import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Snowfall from "./components/Snowfall"; 
import "./VerifyEmail.css"; 

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    const [passwords, setPasswords] = useState({ newPassword: "", confirmPassword: "" });
    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const validations = {
        hasLower: /[a-z]/.test(passwords.newPassword),
        hasUpper: /[A-Z]/.test(passwords.newPassword),
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(passwords.newPassword),
        hasLength: passwords.newPassword.length >= 8
    };

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
        // Clear errors when user starts typing again
        if (status === "error") {
            setStatus("idle");
            setMessage("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 👇 2. BLOCK SUBMISSION IF WEAK
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

    if (status === "success") {
        return (
            <div className="verify-container">
                <Snowfall />
                <div className="verify-card" style={{ zIndex: 1 }}>
                    <div className="icon-circle" style={{ background: "rgba(40, 167, 69, 0.1)" }}>
                        <span style={{ fontSize: "30px" }}>✅</span>
                    </div>
                    <h2 className="title">Password Reset!</h2>
                    <p className="subtitle">You can now login with your new password.</p>
                    <button className="login-btn" onClick={() => navigate("/login")}>Go to Login</button>
                </div>
            </div>
        );
    }

    return (
        <div className="verify-container">
            <Snowfall />
            <div className="verify-card" style={{ maxWidth: "500px", zIndex: 1, position: "relative" }}>
                <h2 className="title">Reset your password</h2>
                
                <form onSubmit={handleSubmit} style={{ textAlign: "left", marginTop: "20px" }}>
                    
                    {/* New Password */}
                    <div style={{ marginBottom: "15px", position: "relative" }}>
                        <label style={{ fontWeight: "600", fontSize: "14px", color: "#374151", marginBottom: "5px", display: "block" }}>
                            New password
                        </label>
                        <input 
                            name="newPassword" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Enter new password"
                            onChange={handleChange}
                            required
                            style={cleanInputStyle} 
                        />
                         <span 
                            onClick={() => setShowPassword(!showPassword)}
                            style={eyeStyle}
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </span>
                    </div>

                    {/* 👇 3. DYNAMIC VALIDATION LIST */}
                    <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "15px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                        <ValidationItem isValid={validations.hasLower} text="One lowercase character" />
                        <ValidationItem isValid={validations.hasSpecial} text="One special character" />
                        <ValidationItem isValid={validations.hasUpper} text="One uppercase character" />
                        <ValidationItem isValid={validations.hasLength} text="8 characters minimum" />
                    </div>

                    {/* Confirm Password */}
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ fontWeight: "600", fontSize: "14px", color: "#374151", marginBottom: "5px", display: "block" }}>
                            Confirm new password
                        </label>
                        <input 
                            name="confirmPassword" 
                            type="password" 
                            placeholder="Confirm new password"
                            onChange={handleChange}
                            required
                            style={cleanInputStyle}
                        />
                    </div>

                    {status === "error" && (
                        <p style={{ 
                            color: "#dc2626", 
                            fontSize: "14px", 
                            textAlign: "center", 
                            background: "#fef2f2", 
                            padding: "10px", 
                            borderRadius: "6px",
                            border: "1px solid #fee2e2"
                        }}>
                            ⚠️ {message}
                        </p>
                    )}

                    <button type="submit" className="login-btn" style={{ backgroundColor: "#0072ff" }} disabled={status === "loading"}>
                        {status === "loading" ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

// 👇 4. HELPER COMPONENT FOR THE CHECKS
const ValidationItem = ({ isValid, text }) => (
    <div style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: "6px",
        color: isValid ? "#16a34a" : "#64748b", 
        transition: "all 0.3s ease",
        fontWeight: isValid ? "600" : "normal"
    }}>
        <span style={{ fontSize: "14px" }}>
            {isValid ? "✓" : "•"}
        </span>
        {text}
    </div>
);

// Styles
const cleanInputStyle = {
    width: "100%", 
    padding: "12px 15px", 
    borderRadius: "8px", 
    border: "1px solid #cbd5e1", 
    backgroundColor: "#ffffff",   
    color: "#1e293b",             
    fontSize: "15px",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.2s"
};

const eyeStyle = {
    position: "absolute", 
    right: "15px", 
    top: "38px", 
    cursor: "pointer", 
    fontSize: "18px",
    color: "#64748b"
};

export default ResetPassword;