import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
    const [userToken, setUserToken] = useState("");

    useEffect(() => {
        // 1. Check if user has a token
        const token = localStorage.getItem("token");
        
        if (!token) {
            // 2. If no token, kick them back to login!
            navigate("/login");
        } else {
            setUserToken(token);
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/login");
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1>🚀 Welcome to Micromart!</h1>
                <p>You are officially logged in.</p>
                
                <div style={styles.tokenBox}>
                    <strong>Your Secret Token:</strong>
                    <p style={{wordBreak: "break-all", fontSize: "12px"}}>{userToken}</p>
                </div>

                <button onClick={handleLogout} style={styles.button}>
                    Logout
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f0f2f5", fontFamily: "Arial" },
    card: { background: "white", padding: "40px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", textAlign: "center", maxWidth: "500px" },
    tokenBox: { background: "#eee", padding: "10px", borderRadius: "5px", margin: "20px 0" },
    button: { backgroundColor: "#dc3545", color: "white", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer", fontSize: "16px" }
};

export default Dashboard;