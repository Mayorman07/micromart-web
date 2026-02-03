// src/pages/Auth/VerifyEmail.jsx
import { useEffect, useState, useRef, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Snowfall from "../../components/Snowfall"; 

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");
    const [status, setStatus] = useState("verifying");
    const hasCalledAPI = useRef(false);

    // Keep the Snowfall logic exactly as is
    const snowflakes = useMemo(() => {
        return [...Array(50)].map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            size: Math.random() * 4 + 2,
            duration: Math.random() * 5 + 5,
            delay: Math.random() * 5,
            opacity: Math.random() * 0.5 + 0.3 
        }));
    }, []);

    useEffect(() => {
        if (!token) {
            setStatus("error");
            return;
        }
        if (hasCalledAPI.current) return;
        hasCalledAPI.current = true;

        axios.get(`http://127.0.0.1:7082/users/api/v1/auth/verify?token=${token}`)
            .then(() => {
                setTimeout(() => setStatus("success"), 800);
            })
            .catch((error) => {
                console.error("Verification failed", error);
                setStatus("error");
            });
    }, [token]);

    return (
        // 1. Vibrant Gradient Background (Matches Login/Signup)
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#00f2fe] to-[#4facfe] relative overflow-hidden font-sans">
            <Snowfall />

            <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/50 text-center mx-4">
                
                {/* ⏳ LOADING STATE */}
                {status === "verifying" && (
                    <>
                        {/* Tailwind Spinner */}
                        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Verifying...</h2>
                        <p className="text-slate-500">Securely connecting to Micromart servers.</p>
                    </>
                )}

                {/* ✅ SUCCESS STATE */}
                {status === "success" && (
                    <>
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Email Verified!</h2>
                        <p className="text-slate-500 mb-6">
                            Welcome to the <strong>MicroMart</strong> family. <br/>
                            Your account is now active and ready.
                        </p>
                        <button 
                            onClick={() => navigate("/login")}
                            className="w-full py-3 rounded-xl text-white font-bold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/30 transition-all"
                        >
                            Proceed to Login
                        </button>
                    </>
                )}

                {/* ❌ ERROR STATE */}
                {status === "error" && (
                    <>
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                             <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-red-600 mb-2">Link Expired</h2>
                        <p className="text-slate-500 mb-6">
                            This verification link is invalid or has already been used.
                        </p>
                        <button 
                            onClick={() => navigate("/login")}
                            className="w-full py-3 rounded-xl text-white font-bold bg-slate-700 hover:bg-slate-800 shadow-lg shadow-slate-500/30 transition-all"
                        >
                            Back to Login
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;