// src/pages/Dashboard/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#00f2fe] to-[#4facfe] font-sans p-4">
            
            {/* 2. Card: Glassmorphism (Wider for Dashboard) */}
            <div className="relative z-10 w-full max-w-3xl bg-white/80 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl border border-white/50 text-center">
                
                {/* 👋 Header Icon */}
                <div className="w-20 h-20 bg-white/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <span className="text-4xl">👋</span>
                </div>

                <h1 className="text-4xl font-extrabold text-slate-800 mb-4">MicroMart Dashboard</h1>
                <p className="text-lg text-slate-600 mb-10">Welcome back! You are securely logged in.</p>

                {/* Session Status Box (Bonus UI element) */}
                <div className="bg-white/50 rounded-xl p-6 mb-8 text-left border border-white/40 shadow-inner">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">System Status</h3>
                    </div>
                    <p className="text-slate-500 text-sm mb-2">Session Active</p>
                    <div className="text-xs font-mono text-slate-400 break-all bg-slate-50 p-3 rounded border border-slate-200">
                        Token: {userToken ? `${userToken.substring(0, 50)}...` : "Loading..."}
                    </div>
                </div>

                {/* Logout Button */}
                <div>
                    <button 
                        onClick={handleLogout} 
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-red-500/30 transition-all transform hover:-translate-y-1 active:translate-y-0"
                    >
                        Log Out
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;