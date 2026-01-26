import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./VerifyEmail.css"; // Reuse card styles

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle"); // idle | loading | success | error

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");

        try {
            // 👇 Call your backend to trigger the email
            await axios.post("http://127.0.0.1:7082/users/users/forgot-password", { email });
            setStatus("success");
        } catch (error) {
            // Even if email fails/doesn't exist, it's safer to show success or a generic error
            // to prevent "User Enumeration" attacks. But for now, let's just error.
            console.error(error);
            setStatus("error");
        }
    };

    if (status === "success") {
        return (
            <div className="verify-container">
                <div className="verify-card">
                    <h2 className="title">Check your mail 📧</h2>
                    <p className="subtitle">
                        If an account exists for <b>{email}</b>, we have sent a password reset link.
                    </p>
                    <Link to="/login" className="login-btn" style={{ textDecoration: 'none' }}>
                        Back to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="verify-container">
            <div className="verify-card" style={{ maxWidth: "450px", marginTop: "50px" }}>
                <h2 className="title">Forgot Password? 🔒</h2>
                <p className="subtitle">Enter your email to receive a reset link.</p>

                <form onSubmit={handleSubmit} style={{ textAlign: "left", display: "grid", gap: "15px" }}>
                    
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
                        <Link to="/login" style={{ color: "#007bff", textDecoration: "none", fontSize: "14px" }}>
                            ← Back to Login
                        </Link>
                    </div>

                </form>
            </div>
        </div>
    );
};

const inputStyle = {
    width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc",
    fontSize: "14px", boxSizing: "border-box", marginTop: "5px"
};

export default ForgotPassword;