import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./VerifyEmail.css"; 

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const token = searchParams.get("token");

    const [passwords, setPasswords] = useState({ newPassword: "", confirmPassword: "" });
    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (passwords.newPassword !== passwords.confirmPassword) {
            setMessage("Passwords do not match!");
            return;
        }

        setStatus("loading");

        try {
            // 2️⃣ Send Token + New Password to Backend
            await axios.post("http://127.0.0.1:7082/users/users/reset-password", {
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
                <div className="verify-card">
                    <h2 className="title">✅ Password Reset!</h2>
                    <p className="subtitle">You can now login with your new password.</p>
                    <button className="login-btn" onClick={() => navigate("/login")}>Go to Login</button>
                </div>
            </div>
        );
    }

    return (
        <div className="verify-container">
            <div className="verify-card" style={{ maxWidth: "500px" }}>
                <h2 className="title">Reset your password</h2>
                
                <form onSubmit={handleSubmit} style={{ textAlign: "left", marginTop: "20px" }}>
                    
                    {/* New Password */}
                    <div style={{ marginBottom: "15px", position: "relative" }}>
                        <label style={{ fontWeight: "bold", fontSize: "14px" }}>New password</label>
                        <input 
                            name="newPassword" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Enter new password"
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                         <span 
                            onClick={() => setShowPassword(!showPassword)}
                            style={eyeStyle}
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </span>
                    </div>

                    {/* Requirements List (Visual Only) */}
                    <div style={{ fontSize: "12px", color: "#666", marginBottom: "15px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px" }}>
                        <span>• One lowercase character</span>
                        <span>• One special character</span>
                        <span>• One uppercase character</span>
                        <span>• 8 characters minimum</span>
                    </div>

                    {/* Confirm Password */}
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ fontWeight: "bold", fontSize: "14px" }}>Confirm new password</label>
                        <input 
                            name="confirmPassword" 
                            type="password" 
                            placeholder="Confirm new password"
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                    </div>

                    {status === "error" && <p style={{ color: "red", fontSize: "14px", textAlign: "center" }}>{message}</p>}

                    <button type="submit" className="login-btn" style={{ backgroundColor: "#28a745" }} disabled={status === "loading"}>
                        {status === "loading" ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

// Styles
const inputStyle = {
    width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", marginTop: "5px", boxSizing: "border-box"
};
const eyeStyle = {
    position: "absolute", right: "10px", top: "35px", cursor: "pointer", fontSize: "16px"
};

export default ResetPassword;