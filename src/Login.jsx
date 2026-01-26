import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Snowfall from "./components/Snowfall"; // 👈 Import the effect (adjust path if needed)
import "./VerifyEmail.css"; 

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
        <div className="verify-container">
            {/* ❄️ The Magic Effect */}
            <Snowfall />

            <div className="verify-card" style={{ maxWidth: "400px", zIndex: 1, position: "relative" }}>
                
                {/* 🔐 Header Icon */}
                <div className="icon-circle" style={{ background: "rgba(255, 255, 255, 0.2)", backdropFilter: "blur(10px)" }}>
                    <svg className="icon-svg" style={{ color: "#0072ff", width: "35px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                </div>

                <h2 className="title" style={{ marginTop: "10px" }}>Welcome Back</h2>
                <p className="subtitle" style={{ marginBottom: "25px" }}>Enter your login details to access Micromart.</p>
                
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    
                    <div style={{ textAlign: "left" }}>
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required 
                            placeholder="Email Address"
                            style={glassInputStyle}
                        />
                    </div>

                    <div style={{ textAlign: "left" }}>
                        <input 
                            type="password" 
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required 
                            placeholder="Password"
                            style={glassInputStyle}
                        />
                    </div>

                    {/* 👇 Forgot Password Link */}
                    <div style={{ textAlign: "right", marginTop: "-5px" }}>
                        <span 
                            onClick={() => navigate("/forgot-password")}
                            style={{ 
                                color: "#0072ff", 
                                fontSize: "14px", 
                                cursor: "pointer", 
                                fontWeight: "600",
                                transition: "color 0.2s"
                            }}
                            onMouseOver={(e) => e.target.style.color = "#0056b3"}
                            onMouseOut={(e) => e.target.style.color = "#0072ff"}
                        >
                            Forgot Password?
                        </span>
                    </div>

                    {status === "error" && (
                        <p style={{ color: "#dc2626", fontSize: "14px", fontWeight: "bold", background: "rgba(220, 38, 38, 0.1)", padding: "10px", borderRadius: "8px" }}>
                            ⚠️ {errorMessage}
                        </p>
                    )}

                    <button 
                        type="submit" 
                        disabled={status === "loading" || status === "success"}
                        className="login-btn"
                        style={{ marginTop: "5px" }}
                    >
                        {status === "loading" ? "Authenticating..." : status === "success" ? "Success! 🔓" : "Sign In"}
                    </button>
                </form>

                <div style={{ marginTop: "25px", fontSize: "14px", color: "#64748b" }}>
                    New to Micromart?{" "}
                    <span 
                        onClick={() => navigate("/signup")} 
                        style={{ color: "#0072ff", cursor: "pointer", fontWeight: "bold", textDecoration: "underline", textUnderlineOffset: "4px" }}
                    >
                        Create an account
                    </span>
                </div>
            </div>
        </div>
    );
};

// 🎨 Styles
const glassInputStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    background: "rgba(255, 255, 255, 0.6)",
    fontSize: "16px",
    outline: "none",
    transition: "all 0.3s ease",
    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)",
    color: "#1e293b",
    boxSizing: "border-box"
};

export default Login;