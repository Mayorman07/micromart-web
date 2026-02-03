// src/pages/Auth/Login.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
        // 1. Container: Full screen + VIBRANT Gradient (Fixed First Div)
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#00f2fe] to-[#4facfe] relative overflow-hidden font-sans">
            <Snowfall />

            {/* 2. Card: Glassmorphism + 3D Shadow */}
            <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/50 text-center mx-4">
                
                {/* 🔐 Header Icon */}
                <div className="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                </div>

                <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h2>
                <p className="text-slate-500 mb-8">Enter your login details to access Micromart.</p>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
                    
                    <div>
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required 
                            placeholder="Email Address"
                            className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/40 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-700 placeholder-slate-400"
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
                            className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/40 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-700 placeholder-slate-400"
                        />
                    </div>

                    {/* Forgot Password Link */}
                    <div className="text-right">
                        <span 
                            onClick={() => navigate("/forgot-password")}
                            className="text-sm text-blue-600 hover:text-blue-800 font-semibold cursor-pointer transition-colors"
                        >
                            Forgot Password?
                        </span>
                    </div>

                    {status === "error" && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm font-medium text-center">
                            ⚠️ {errorMessage}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={status === "loading" || status === "success"}
                        className={`w-full py-3.5 rounded-xl text-white font-bold text-lg shadow-lg shadow-blue-500/30 transition-all duration-200 transform hover:-translate-y-0.5
                            ${status === 'loading' ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'}
                        `}
                    >
                        {status === "loading" ? "Authenticating..." : status === "success" ? "Success! 🔓" : "Sign In"}
                    </button>
                </form>

                <div className="mt-8 text-sm text-slate-500">
                    New to Micromart?{" "}
                    <span 
                        onClick={() => navigate("/signup")} 
                        className="text-blue-600 font-bold cursor-pointer hover:underline underline-offset-2"
                    >
                        Create an account
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Login;