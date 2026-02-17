import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Snowfall from "../../components/Snowfall"; // ✅ Brought back

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");
    const [status, setStatus] = useState("verifying");
    
    // Critical Ref Logic preserved
    const hasCalledAPI = useRef(false);

    useEffect(() => {
        if (!token || hasCalledAPI.current) return;
        hasCalledAPI.current = true;

        console.log("🚀 Verifying token...");
    
        axios.get(`http://127.0.0.1:7082/users/api/v1/auth/verify?token=${token}`)
            .then((response) => {
                console.log("✅ Verified:", response.data);
                // Tiny delay for UX smoothness
                setTimeout(() => setStatus("success"), 500);
            })
            .catch((error) => {
                console.error("❌ Failed:", error);
                setStatus("error");
            });
            
    }, [token]);

    return (
        // ✅ 1. RESTORED VIBRANT GRADIENT
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans bg-gradient-to-br from-[#00f2fe] to-[#4facfe] selection:bg-white/30">
            
            {/* ✅ 2. RESTORED SNOWFALL */}
            <div className="absolute inset-0 z-0">
                <Snowfall />
            </div>

            {/* 3. GLASS CARD (Kept the modern polish, but made it fit the blue theme) */}
            {/* bg-white/80 allows the blue to bleed through slightly, creating a true 'icy' feel */}
            <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-[0_20px_50px_rgb(0,0,0,0.15)] border border-white/50 text-center mx-4 transition-all duration-500">
                
                {/* Brand Logo */}
                <div className="mb-8 flex justify-center">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-xl tracking-tight">
                        <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-lg shadow-blue-400/50 shadow-lg">M</span>
                        MicroMart
                    </div>
                </div>

                {/* ⏳ VERIFYING STATE */}
                {status === "verifying" && (
                    <div className="flex flex-col items-center py-6 animate-pulse">
                        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6"></div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Verifying...</h2>
                        <p className="text-slate-500 text-sm">Securely connecting to MicroMart servers.</p>
                    </div>
                )}

                {/* ✅ SUCCESS STATE */}
                {status === "success" && (
                  <div className="animate-[fadeIn_0.5s_ease-out]">
                      <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                          <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-25"></div>
                          <div className="relative w-20 h-20 bg-gradient-to-br from-green-50 to-green-100 rounded-full flex items-center justify-center border border-green-200 shadow-sm">
                              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                              </svg>
                          </div>
                      </div>
                      
                      <h2 className="text-3xl font-extrabold text-slate-800 mb-3 tracking-tight">You're All Set!</h2>
                      <p className="text-slate-600 mb-8 px-2 text-sm leading-relaxed">
                          Your <strong className="text-blue-600">MicroMart</strong> account is now fully active.
                      </p>
                      
                      {/* Gradient Button to match background theme */}
                      <button 
                          onClick={() => navigate("/login")}
                          className="w-full py-4 rounded-xl text-white font-semibold text-lg bg-slate-900 hover:bg-slate-800 hover:scale-[1.01] hover:shadow-xl hover:shadow-slate-900/20 transition-all duration-200 active:scale-[0.98]"
                      >
                          Proceed to Login
                      </button>
                  </div>
                )}

                {/* ❌ ERROR STATE */}
                {status === "error" && (
                    <div className="animate-[shake_0.5s_ease-in-out]">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100">
                             <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </div>
                        
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Verification Failed</h2>
                        <p className="text-slate-500 mb-8 text-sm px-4">
                            This link is invalid or has expired. Please try logging in directly.
                        </p>
                        
                        <button 
                            onClick={() => navigate("/login")}
                            className="w-full py-3.5 rounded-xl text-white font-semibold bg-red-600 hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30"
                        >
                            Back to Login
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
            `}</style>
        </div>
    );
};

export default VerifyEmail;