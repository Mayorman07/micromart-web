import { useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./VerifyEmail.css"; 

const Login = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState("idle");
    const [errorMessage, setErrorMessage] = useState("");
    
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    // ❄️ SNOWFLAKES: Because even logins should be magical
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

            // Extract Token
            const token = response.data.token;
            const userId = response.data.userId;

            if (!token) throw new Error("Token missing");

            // Save to Browser
            localStorage.setItem("token", token);
            localStorage.setItem("userId", userId);

            setStatus("success");
            
            // Redirect to Dashboard
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
            {/* ❄️ Render Snowflakes */}
            {snowflakes.map((flake) => (
                <div 
                    key={flake.id}
                    className="snowflake"
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

            <div className="verify-card" style={{ maxWidth: "400px" }}>
                
                {/* 🔐 Header Icon */}
                <div className="icon-circle" style={{ background: "rgba(255, 255, 255, 0.2)", backdropFilter: "blur(10px)" }}>
                    <svg className="icon-svg" style={{ color: "#0072ff", width: "35px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                </div>

                <h2 className="title" style={{ marginTop: "10px" }}>Welcome Back</h2>
                <p className="subtitle" style={{ marginBottom: "25px" }}>Enter your credentials to access Micromart.</p>
                
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

                    {status === "error" && (
                        <p style={{ color: "#dc2626", fontSize: "14px", fontWeight: "bold", background: "rgba(220, 38, 38, 0.1)", padding: "10px", borderRadius: "8px" }}>
                            ⚠️ {errorMessage}
                        </p>
                    )}

                    <button 
                        type="submit" 
                        disabled={status === "loading" || status === "success"}
                        className="login-btn"
                        style={{ marginTop: "10px" }}
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

// 🎨 Custom Glass Input Styles
const glassInputStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.3)", // Subtle border
    background: "rgba(255, 255, 255, 0.6)", // Semi-transparent white
    fontSize: "16px",
    outline: "none",
    transition: "all 0.3s ease",
    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)",
    color: "#1e293b",
    boxSizing: "border-box"
};

export default Login;