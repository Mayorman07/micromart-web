import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// 👇 Import the styles
import styles from "./Dashboard.module.css"; 

const Dashboard = () => {
    const navigate = useNavigate();
    const [userToken, setUserToken] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate('/login');
        } else {
            setUserToken(token);
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate('/login');
    };

    return (
        // 1. Container gives the blue gradient
        <div className={styles.dashboardContainer}>
            
            {/* 2. Card gives the glass effect */}
            <div className={styles.card}>
                <h1 className={styles.title}>MicroMart Dashboard</h1>
                <p className={styles.subtitle}>Welcome back! You are securely logged in.</p>

                <div style={{ marginTop: "40px" }}>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        Log Out
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;