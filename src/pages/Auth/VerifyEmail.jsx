import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../services/api"; 
import Snowfall from "../../components/Snowfall";

/**
 * VerifyEmail Component
 * Processes the email verification token sent via the user registration flow.
 * Interfaces with the Spring Boot authentication verification endpoint via the centralized service.
 */
const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");
    const [status, setStatus] = useState("verifying");
    
    /**
     * Prevents double-execution of the verification request in React Strict Mode 
     * by tracking the API call state.
     */
    const hasCalledAPI = useRef(false);

    useEffect(() => {
        if (!token || hasCalledAPI.current) return;
        hasCalledAPI.current = true;

        /**
         * Dispatches verification token to the backend.
         * Utilizing the api instance ensures consistent baseURL application.
         */
        api.get(`/users/api/v1/auth/verify?token=${token}`)
            .then((response) => {
                console.log("Account Verified Successfully:", response.data);
                setTimeout(() => setStatus("success"), 500);
            })
            .catch((error) => {
                console.error("Verification Error:", error);
                setStatus("error");
            });
            
    }, [token]);

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans bg-gradient-to-br from-[#00f2fe] to-[#4facfe] selection:bg-white/30">
            
            {/* Background Layer */}
            <div className="absolute inset-0 z-0">
                <Snowfall />
            </div>

            {/* Verification Card */}
            <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgb(0,0,0,0.1)] border border-white/50 text-center mx-4">
                
                {/* Branding */}
                <div className="mb-10 flex justify-center">
                    <div className="flex items-center gap-2 text-slate-800 font-black text-xl tracking-tighter uppercase">
                        <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm shadow-blue-400/50 shadow-lg">M</span>
                        MicroMart
                    </div>
                </div>

                {/* --- LOADING STATE --- */}
                {status === "verifying" && (
                    <div className="flex flex-col items-center py-6">
                        <div className="w-16 h-16 border-[3px] border-blue-100 border-t-blue-600 rounded-full animate-spin mb-8"></div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Authenticating...</h2>
                        <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">Verifying registration token</p>
                    </div>
                )}

                {/* --- SUCCESS STATE --- */}
                {status === "success" && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <div className="relative w-20 h-20 mx-auto mb-8 flex items-center justify-center">
                          <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-25"></div>
                          <div className="relative w-20 h-20 bg-gradient-to-br from-green-50 to-green-100 rounded-full flex items-center justify-center border border-green-200">
                              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                              </svg>
                          </div>
                      </div>
                      
                      <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight uppercase">Account Verified</h2>
                      <p className="text-slate-600 mb-8 px-2 text-xs font-medium leading-relaxed">
                          Your <strong className="text-blue-600">MicroMart</strong> profile is now active. Access to the administrative dashboard has been granted.
                      </p>
                      
                      <button 
                          onClick={() => navigate("/login")}
                          className="w-full py-4 rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] bg-slate-900 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20"
                      >
                          Proceed to Sign In
                      </button>
                  </div>
                )}

                {/* --- ERROR STATE --- */}
                {status === "error" && (
                    <div className="animate-in zoom-in-95 duration-300">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-100">
                             <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </div>
                        
                        <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Access Error</h2>
                        <p className="text-slate-500 mb-8 text-[11px] font-bold uppercase tracking-widest px-4">
                            Invalid Token: Link is expired or incorrect.
                        </p>
                        
                        <button 
                            onClick={() => navigate("/login")}
                            className="w-full py-4 rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] bg-red-600 hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20"
                        >
                            Return to Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;