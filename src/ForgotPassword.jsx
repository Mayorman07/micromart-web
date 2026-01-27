import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Snowfall from "./components/Snowfall"; // ❄️ Import Snowflakes
import "./VerifyEmail.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle"); // idle | loading | success | error

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");

        try {
            await axios.post("http://127.0.0.1:7082/users/password-reset/request", { email });
            setStatus("success");
        } catch (error) {
            console.error(error);
            // Optional: You can set a generic error message here if needed
            setStatus("error");
        }
    };

    if (status === "success") {
        return (
            <div className="verify-container">
                {/* ❄️ Snowflakes for Success Screen */}
                <Snowfall />

                <div className="verify-card" style={{ zIndex: 1, position: "relative" }}>
                    <div className="icon-circle" style={{ background: "rgba(40, 167, 69, 0.1)" }}>
                        <span style={{ fontSize: "30px" }}>📧</span>
                    </div>
                    <h2 className="title">Check your mail</h2>
                    <p className="subtitle">
                        If an account exists for <b>{email}</b>, we have sent a password reset link.
                    </p>
                    <Link to="/login" className="login-btn" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '15px' }}>
                        Back to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="verify-container">
            {/* ❄️ Snowflakes Background */}
            <Snowfall />

            <div className="verify-card" style={{ maxWidth: "450px", marginTop: "50px", zIndex: 1, position: "relative" }}>
                
                {/* 🔒 Lock Icon */}
                <div className="icon-circle" style={{ background: "rgba(0, 114, 255, 0.1)" }}>
                    <svg className="icon-svg" style={{ color: "#0072ff", width: "30px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                </div>

                <h2 className="title" style={{ marginTop: "10px" }}>Forgot Password?</h2>
                <p className="subtitle">Enter your email to receive a reset link.</p>

                <form onSubmit={handleSubmit} style={{ textAlign: "left", display: "grid", gap: "15px", marginTop: "20px" }}>
                    
                    <div>
                        <label style={{ fontSize: "14px", fontWeight: "bold", color: "#333" }}>Email Address</label>
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            style={inputStyle} 
                        />
                    </div>

                    <button type="submit" className="login-btn" disabled={status === "loading"}>
                        {status === "loading" ? "Sending Link..." : "Send Reset Link"}
                    </button>

                    <div style={{ textAlign: "center", marginTop: "10px" }}>
                        <Link to="/login" style={{ color: "#007bff", textDecoration: "none", fontSize: "14px", fontWeight: "bold" }}>
                            ← Back to Login
                        </Link>
                    </div>

                </form>
            </div>
        </div>
    );
};

const inputStyle = {
    width: "100%", 
    padding: "12px", 
    borderRadius: "8px", 
    border: "1px solid #ccc",
    fontSize: "14px", 
    boxSizing: "border-box", 
    marginTop: "5px",
    backgroundColor: "white",
    color: "#333"
};

export default ForgotPassword;