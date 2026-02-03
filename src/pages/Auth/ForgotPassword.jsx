// src/pages/Auth/ForgotPassword.jsx
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; 
// 👇 Import the premium components
import LiquidBackgroundDeep from "../../components/LiquidBackgroundDeep";
import Snowfall from "../../components/Snowfall"; 

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle"); 
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMessage("");

        try {
            // ✅ Your original endpoint is preserved here
            await axios.post("http://127.0.0.1:7082/users/password-reset/request", { email });
            setStatus("success");
        } catch (error) {
            console.error("Request Failed", error);
            setStatus("error");
            setErrorMessage(error.response?.data?.message || "Something went wrong. Try again.");
        }
    };

    // ✨ The "Frosted Porcelain" Input Style
    const proInput = "w-full px-4 py-3.5 rounded-xl bg-slate-50/50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all font-medium shadow-sm";

    // ✅ Success State (Premium UI)
    if (status === "success") {
        return (
            <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans">
                <LiquidBackgroundDeep />
                <Snowfall />

                <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-xl p-10 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,180,216,0.5)] border border-white/60 text-center mx-4">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-green-100">
                        <span className="text-4xl">📧</span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Check your mail</h2>
                    <p className="text-slate-500 mb-6 font-medium">
                        We have sent a password reset link to <br/> 
                        <span className="font-bold text-slate-800">{email}</span>
                    </p>
                    
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100 mb-8 text-sm text-green-700 font-medium">
                        Did not receive the email? Check your spam folder or try again.
                    </div>

                    <Link 
                        to="/login" 
                        className="w-full inline-block py-4 rounded-xl text-white font-bold text-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:to-blue-700 shadow-xl shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5"
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        );
    }

    // 📝 Request Form (Premium UI)
    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans">
            
            {/* Background Layers */}
            <LiquidBackgroundDeep />
            <Snowfall />

            {/* The Frosted Porcelain Card */}
            <div className="relative z-10 w-full max-w-md p-10 mx-4 text-center 
                bg-white/95 
                backdrop-blur-xl 
                rounded-3xl 
                shadow-[0_20px_60px_-15px_rgba(0,180,216,0.5)] 
                border border-white/60"
            >
                
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-cyan-50/80 flex items-center justify-center text-cyan-600 shadow-sm border border-cyan-100">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                    </svg>
                </div>

                <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Forgot Password?</h2>
                <p className="text-slate-500 mb-8 font-medium">No worries, we'll send you reset instructions.</p>

                <form onSubmit={handleSubmit} className="text-left">
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1 tracking-wider">Email Address</label>
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                            className={proInput}
                        />
                    </div>

                    {status === "error" && (
                        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium text-center">
                            ⚠️ {errorMessage}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={status === "loading"}
                        className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-xl shadow-cyan-500/20 transition-all duration-200 transform hover:-translate-y-0.5
                            ${status === 'loading' 
                                ? 'bg-slate-300 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:to-blue-700'
                            }
                        `}
                    >
                        {status === "loading" ? "Sending Link..." : "Reset Password"}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <Link to="/login" className="text-cyan-600 font-bold hover:text-cyan-800 transition-colors flex items-center justify-center gap-2">
                        <span>←</span> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;