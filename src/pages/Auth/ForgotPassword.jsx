// src/pages/Auth/ForgotPassword.jsx
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; 
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
            await axios.post("http://127.0.0.1:7082/users/password-reset/request", { email });
            setStatus("success");
        } catch (error) {
            console.error("Request Failed", error);
            setStatus("error");
            setErrorMessage(error.response?.data?.message || "Something went wrong. Try again.");
        }
    };

    // ✅ Success State
    if (status === "success") {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#00f2fe] to-[#4facfe] relative overflow-hidden font-sans">
                <Snowfall />
                <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/50 text-center mx-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <span className="text-3xl">📧</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Check your mail</h2>
                    <p className="text-slate-500 mb-6">
                        We have sent a password reset link to <br/> 
                        <span className="font-semibold text-slate-800">{email}</span>
                    </p>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100 mb-6 text-sm text-green-700">
                        Did not receive the email? Check your spam folder or try again.
                    </div>
                    <div className="text-sm text-slate-500 mt-4">
                        <Link to="/login" className="text-blue-600 font-bold hover:underline">Back to Login</Link>
                    </div>
                </div>
            </div>
        );
    }

    // 📝 Request Form
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#00f2fe] to-[#4facfe] relative overflow-hidden font-sans">
            <Snowfall />
            <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/50 text-center mx-4">
                
                <div className="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                    </svg>
                </div>

                <h2 className="text-3xl font-bold text-slate-800 mb-2">Forgot Password?</h2>
                <p className="text-slate-500 mb-8">No worries, we'll send you reset instructions.</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
                    <div>
                        <label className="block mb-1 text-slate-700 font-semibold text-sm">Email Address</label>
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                            className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/40 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-700 placeholder-slate-400"
                        />
                    </div>

                    {status === "error" && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm font-medium text-center">
                            ⚠️ {errorMessage}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={status === "loading"}
                        className={`w-full py-3.5 rounded-xl text-white font-bold text-lg shadow-lg shadow-blue-500/30 transition-all duration-200 transform hover:-translate-y-0.5
                            ${status === 'loading' ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'}
                        `}
                    >
                        {status === "loading" ? "Sending Link..." : "Reset Password"}
                    </button>
                </form>

                <div className="mt-8 text-sm text-slate-500">
                    <Link to="/login" className="text-blue-600 font-bold hover:underline">
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;