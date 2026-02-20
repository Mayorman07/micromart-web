import { useState } from "react";
import api from "../../services/api"; 
import { Link } from "react-router-dom"; 
import LiquidBackgroundDeep from "../../components/LiquidBackgroundDeep";
import Snowfall from "../../components/Snowfall"; 

/**
 * ForgotPassword Component
 * Initiates the password recovery process by sending a reset link to the user's email.
 * Connects to the Spring Boot password-reset-request endpoint via the centralized API.
 */
const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle"); 
    const [errorMessage, setErrorMessage] = useState("");

    /**
     * Handles the password reset request submission.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMessage("");

        try {
            /** * Utilizing the api instance ensures consistent baseURL and 
             * global interceptor configurations are applied 
             */
            await api.post("/users/password-reset/request", { email });
            setStatus("success");
        } catch (error) {
            console.error("Reset Request Error:", error);
            setStatus("error");
            // Extracting standardized error message from response
            setErrorMessage(error.response?.data?.message || "An error occurred. Please try again later.");
        }
    };

    const inputStyle = "w-full px-4 py-3.5 rounded-xl bg-slate-50/50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all font-medium shadow-sm";

    if (status === "success") {
        return (
            <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans">
                <LiquidBackgroundDeep />
                <Snowfall />

                <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-xl p-10 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,180,216,0.3)] border border-white/60 text-center mx-4">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100">
                        <span className="text-4xl" role="img" aria-label="envelope">✉️</span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Check your email</h2>
                    <p className="text-slate-500 mb-6 font-medium leading-relaxed">
                        A password reset link has been sent to: <br/> 
                        <span className="font-bold text-slate-800">{email}</span>
                    </p>
                    
                    <div className="bg-green-50/50 p-4 rounded-xl border border-green-100 mb-8 text-sm text-green-700 font-medium">
                        If you don't see it within a few minutes, please check your spam folder.
                    </div>

                    <Link 
                        to="/login" 
                        className="w-full inline-block py-4 rounded-xl text-white font-bold text-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-700 shadow-xl shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5"
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans">
            <LiquidBackgroundDeep />
            <Snowfall />

            <div className="relative z-10 w-full max-w-md p-10 mx-4 text-center bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,180,216,0.3)] border border-white/60">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-cyan-50/80 flex items-center justify-center text-cyan-600 border border-cyan-100">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                    </svg>
                </div>

                <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Forgot Password?</h2>
                <p className="text-slate-500 mb-8 font-medium">Enter your email and we'll send you reset instructions.</p>

                <form onSubmit={handleSubmit} className="text-left">
                    <div className="mb-6">
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-[0.1em]">Registered Email</label>
                        <input 
                            type="email" 
                            placeholder="name@example.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                            className={inputStyle}
                        />
                    </div>

                    {status === "error" && (
                        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium text-center">
                            {errorMessage}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={status === "loading"}
                        className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-xl shadow-cyan-500/10 transition-all duration-200 transform hover:-translate-y-0.5
                            ${status === 'loading' 
                                ? 'bg-slate-300 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-700'
                            }
                        `}
                    >
                        {status === "loading" ? "Processing..." : "Send Reset Link"}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <Link to="/login" className="text-cyan-600 font-bold hover:text-cyan-800 transition-colors flex items-center justify-center gap-2 text-sm uppercase tracking-widest">
                        <span>←</span> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;