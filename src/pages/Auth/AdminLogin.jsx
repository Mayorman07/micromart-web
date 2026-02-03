// src/pages/Auth/Login.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LiquidBackgroundVibrant from "../../components/LiquidBackgroundDark";
import Snowfall from "../../components/Snowfall";

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
            
            setTimeout(() => navigate("/dashboard"), 1000);

        } catch (error) {
            console.error("Login Failed", error);
            setStatus("error");
            setErrorMessage("Invalid email or password.");
        }
    };

    // 💎 Premium Crystal Input Style
    // Less white, more transparency, cleaner borders
    const crystalInput = "w-full px-5 py-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:bg-white/30 focus:border-white/60 focus:ring-2 focus:ring-white/20 transition-all backdrop-blur-sm";

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans">
            
            {/* LAYER 1: The Vibrant Liquid Background */}
            <LiquidBackgroundVibrant />

            {/* LAYER 2: The Snowfall (Classic) */}
            <Snowfall />

            {/* LAYER 3: The Premium Crystal Card */}
            {/* Note: changed bg-white/30 to bg-white/10 for a clearer, richer look */}
            <div className="relative z-10 w-full max-w-md p-10 mx-4 text-center 
                bg-white/10 
                backdrop-blur-xl 
                rounded-3xl 
                border border-white/40 
                shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
            >
                {/* Header Icon */}
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/30 shadow-inner">
                    <svg className="w-8 h-8 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                </div>

                <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-md">
                    Welcome Back
                </h2>
                <p className="text-blue-50 mb-8 font-medium drop-shadow-sm">Access your MicroMart dashboard.</p>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
                    <div>
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required 
                            placeholder="Email Address"
                            className={crystalInput}
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
                            className={crystalInput}
                        />
                    </div>

                    <div className="text-right">
                        <span 
                            onClick={() => navigate("/forgot-password")}
                            className="text-sm text-white hover:text-blue-100 cursor-pointer transition-colors font-semibold tracking-wide drop-shadow-sm"
                        >
                            Forgot Password?
                        </span>
                    </div>

                    {status === "error" && (
                        <div className="p-3 rounded-xl bg-red-500/30 border border-red-200/50 text-white text-sm font-medium text-center backdrop-blur-md">
                            ⚠️ {errorMessage}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={status === "loading" || status === "success"}
                        className={`w-full py-4 rounded-xl font-bold text-lg text-blue-600 shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-white/20
                            ${status === 'loading' 
                                ? 'bg-white/50 cursor-not-allowed text-white' 
                                : 'bg-white hover:bg-blue-50'
                            }
                        `}
                    >
                        {status === "loading" ? "Authenticating..." : "Sign In"}
                    </button>
                </form>

                <div className="mt-8 text-sm text-white/80 font-medium">
                    New to Micromart?{" "}
                    <span 
                        onClick={() => navigate("/signup")} 
                        className="text-white font-bold cursor-pointer hover:underline underline-offset-4 decoration-2"
                    >
                        Create an account
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;