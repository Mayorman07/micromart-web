import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    
    // State to hold form data
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [status, setStatus] = useState("idle"); // 'idle', 'loading', 'error'
    const [errorMessage, setErrorMessage] = useState("");

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle Form Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMessage("");

        try {
            // 🚀 sending request to Gateway
            // Note: URL is /users/users/login based on your Gateway routes
            const response = await axios.post(
                "http://127.0.0.1:7082/users/users/login", 
                formData
            );

            console.log("✅ Login Success!", response);
            console.log("🔑 Headers:", response.headers);

            // TODO: We will extract the token here in the next step
            // const token = response.headers["token"] || response.headers["authorization"];

            setStatus("success");
            
            // Temporary alert until we finish the redirect logic
            alert("Login Successful! Check Console for Token.");

        } catch (error) {
            console.error("❌ Login Failed", error);
            setStatus("error");
            
            if (error.response && error.response.status === 401) {
                setErrorMessage("Invalid email or password.");
            } else {
                setErrorMessage("Something went wrong. Is the backend running?");
            }
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={{ marginBottom: "20px", color: "#333" }}>🔐 Login to Micromart</h2>
                
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label>Email</label>
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required 
                            style={styles.input}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label>Password</label>
                        <input 
                            type="password" 
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required 
                            style={styles.input}
                            placeholder="Enter your password"
                        />
                    </div>

                    {status === "error" && (
                        <p style={{ color: "red", fontSize: "14px" }}>{errorMessage}</p>
                    )}

                    <button 
                        type="submit" 
                        disabled={status === "loading"}
                        style={styles.button}
                    >
                        {status === "loading" ? "Signing in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

// Simple Styles
const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
        fontFamily: "Arial, sans-serif"
    },
    card: {
        background: "white",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "400px",
        textAlign: "center"
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "15px"
    },
    inputGroup: {
        textAlign: "left",
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        fontSize: "14px",
        color: "#555"
    },
    input: {
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        fontSize: "16px"
    },
    button: {
        backgroundColor: "#28a745",
        color: "white",
        border: "none",
        padding: "12px",
        borderRadius: "5px",
        fontSize: "16px",
        cursor: "pointer",
        marginTop: "10px",
        fontWeight: "bold"
    }
};

export default Login;