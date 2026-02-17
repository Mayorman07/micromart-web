// src/pages/Auth/AdminLogin.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// 👇 Import the DARK Liquid Background
import LiquidBackground from "../../components/LiquidBackgroundDark"; 

const AdminLogin = () => {
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
            // 👇 Verify if you need a specific admin endpoint or if it's the same
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
            
            // 👇 Redirect to dashboard (or admin dashboard if you have one)
            setTimeout(() => navigate("/admin/dashboard"), 1000);

        } catch (error) {
            console.error("Login Failed", error);
            setStatus("error");
            setErrorMessage("Invalid admin credentials.");
        }
    };

    // 🌑 Dark Crystal Input Style (Sci-fi look)
    const darkInput = "w-full px-5 py-4 rounded-xl bg-slate-900/50 border border-slate-700 text-cyan-100 placeholder-slate-500 focus:outline-none focus:bg-slate-900/80 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all backdrop-blur-sm";

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans">
            
            {/* LAYER 1: The Dark Liquid Background */}
            <LiquidBackground />

            {/* LAYER 2: The Admin Card (Dark Glass) */}
            <div className="relative z-10 w-full max-w-md p-10 mx-4 text-center 
                bg-slate-900/40 
                backdrop-blur-2xl 
                rounded-3xl 
                border border-white/10 
                shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
                {/* Header Icon (Cyan Glow) */}
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-cyan-900/30 flex items-center justify-center backdrop-blur-md border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                    <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                </div>

                <h2 className="text-3xl font-bold text-white mb-2 tracking-wide">
                    Admin Portal
                </h2>
                <p className="text-slate-400 mb-8 font-medium">Secure System Access</p>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
                    <div>
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required 
                            placeholder="Admin Email"
                            className={darkInput}
                        />
                    </div>

                    <div>
                        <input 
                            type="password" 
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required 
                            placeholder="Password"
                            className={darkInput}
                        />
                    </div>

                    {status === "error" && (
                        <div className="p-3 rounded-xl bg-red-900/30 border border-red-500/50 text-red-200 text-sm font-medium text-center backdrop-blur-md">
                            ⚠️ {errorMessage}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={status === "loading" || status === "success"}
                        className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all duration-300 transform hover:-translate-y-1
                            ${status === 'loading' 
                                ? 'bg-slate-700 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 border border-cyan-500/30 shadow-cyan-900/20'
                            }
                        `}
                    >
                        {status === "loading" ? "Verifying..." : "Access System"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;