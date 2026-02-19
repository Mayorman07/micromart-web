import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LiquidBackgroundDeep from "../../components/LiquidBackgroundDeep";
import Snowfall from "../../components/Snowfall";

/**
 * Login Component
 * Handles user authentication and session persistence.
 * Connects to the Spring Boot /login endpoint to retrieve JWT.
 */
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

    /**
     * Submits credentials to the backend.
     * On success, stores JWT and redirects to the user dashboard.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMessage("");

        try {
            const response = await axios.post(
                "http://127.0.0.1:7082/users/users/login", 
                formData
            );

            const { token, userId } = response.data;
            
            if (!token) throw new Error("Authentication failed: No token provided.");

            // Store session data
            localStorage.setItem("token", token);
            localStorage.setItem("userId", userId);
            
            setStatus("success");
            
            // Navigate to main user dashboard after a brief delay
            setTimeout(() => navigate("/dashboard"), 800);

        } catch (error) {
            console.error("Login Error:", error);
            setStatus("error");
            setErrorMessage(error.response?.data?.message || "Invalid email or password.");
        }
    };

    // Standardized input styling for light-themed auth forms
    const inputStyle = "w-full px-4 py-3.5 rounded-xl bg-slate-50/50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all font-medium shadow-sm";

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans">
            
            <LiquidBackgroundDeep />
            <Snowfall />

            {/* Authentication Card */}
            <div className="relative z-10 w-full max-w-md p-10 mx-4 text-center 
                bg-white/95
                backdrop-blur-xl
                rounded-3xl 
                shadow-[0_20px_60px_-15px_rgba(0,180,216,0.3)]
                border border-white/60"
            >
                {/* Header Icon */}
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-cyan-50/80 flex items-center justify-center text-cyan-600 border border-cyan-100 shadow-sm">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                </div>

                <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
                    Welcome Back
                </h2>
                <p className="text-slate-500 mb-8 font-medium">Please sign in to access your account.</p>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Email Address</label>
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required 
                            placeholder="name@example.com"
                            className={inputStyle}
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Password</label>
                        <input 
                            type="password" 
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required 
                            placeholder="••••••••"
                            className={inputStyle}
                        />
                    </div>

                    <div className="flex items-center justify-end">
                        <button 
                            type="button"
                            onClick={() => navigate("/forgot-password")}
                            className="text-xs text-cyan-600 hover:text-cyan-800 font-bold transition-colors uppercase tracking-tighter"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    {status === "error" && (
                        <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium text-center">
                            {errorMessage}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={status === "loading" || status === "success"}
                        className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-xl shadow-cyan-500/10 transition-all duration-200 transform hover:-translate-y-0.5
                            ${status === 'loading' 
                                ? 'bg-slate-300 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-700'
                            }
                        `}
                    >
                        {status === "loading" ? "Authenticating..." : "Sign In"}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-200/60 text-xs text-slate-500 font-medium uppercase tracking-widest">
                    Don't have an account?{" "}
                    <button 
                        onClick={() => navigate("/signup")} 
                        className="text-cyan-600 font-black hover:text-cyan-800 transition-colors ml-1"
                    >
                        Create Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;