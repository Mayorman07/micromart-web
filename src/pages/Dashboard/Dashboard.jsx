import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
        // 2. Use the styles here!
        <div className={styles.dashboardContainer}>
            <h1 className={styles.welcomeText}>MicroMart Dashboard</h1>
            
            <p>Welcome back! You are logged in.</p>

            <button onClick={handleLogout} style={{ marginTop: "20px" }}>
                Log Out
            </button>
        </div>
    );
};

export default Dashboard;