import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../services/api"; 
import Snowfall from "../../components/Snowfall"; 

/**
 * ResetPassword Component
 * Facilitates the establishment of new user credentials via a verified reset token.
 * Interfaces with the Spring Boot password-reset/reset endpoint via the centralized service.
 */
const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    const [passwords, setPasswords] = useState({ newPassword: "", confirmPassword: "" });
    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    /**
     * Password Complexity Validations
     * Aligns with the standard backend DTO validation requirements.
     */
    const validations = {
        hasLower: /[a-z]/.test(passwords.newPassword),
        hasUpper: /[A-Z]/.test(passwords.newPassword),
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(passwords.newPassword),
        hasLength: passwords.newPassword.length >= 8
    };

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
        if (status === "error") {
            setStatus("idle");
            setMessage("");
        }
    };

    /**
     * Dispatches the new credentials and verification token to the server.
     * Validates complexity requirements client-side prior to network transmission.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const isComplex = Object.values(validations).every(v => v === true);
        if (!isComplex) {
            setMessage("Password must meet all complexity requirements.");
            setStatus("error");
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            setMessage("Passwords do not match.");
            setStatus("error");
            return;
        }

        setStatus("loading");

        try {
            /** * Utilizing the api instance ensures consistent baseURL and 
             * global interceptor configurations are applied 
             */
            await api.post("/users/password-reset/reset", {
                token: token,
                newPassword: passwords.newPassword
            });
            setStatus("success");
        } catch (error) {
            setStatus("error");
            // Extracting standardized error message from the response
            setMessage(error.response?.data?.message || "Reset link is invalid or has expired.");
        }
    };

    if (status === "success") {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#00f2fe] to-[#4facfe] relative overflow-hidden font-sans">
                <Snowfall />
                <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/50 text-center mx-4">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100">
                        <span className="text-2xl" role="img" aria-label="success">✓</span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Success!</h2>
                    <p className="text-slate-500 mb-8 font-medium">Your password has been updated. You can now sign in with your new credentials.</p>
                    <button 
                        onClick={() => navigate("/login")}
                        className="w-full py-4 rounded-xl text-white font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-xl shadow-blue-500/20 transition-all uppercase tracking-widest text-xs"
                    >
                        Return to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#00f2fe] to-[#4facfe] relative overflow-hidden font-sans py-10">
            <Snowfall />
            
            <div className="relative z-10 w-full max-w-md bg-white/85 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl border border-white/50 text-center mx-4">
                <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight uppercase">Update Password</h2>
                <p className="text-slate-500 mb-8 text-sm font-medium">Please enter and confirm your new password.</p>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
                    <div className="relative">
                        <label className="block mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                        <input 
                            name="newPassword" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Min. 8 characters"
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3.5 rounded-2xl bg-white/60 border border-white focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-800 placeholder-slate-400 pr-12 shadow-sm"
                        />
                         <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-10 text-slate-400 hover:text-blue-600 transition-colors text-[10px] font-bold uppercase tracking-widest"
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 px-1 mb-2">
                        <ValidationItem isValid={validations.hasLower} text="Lowercase" />
                        <ValidationItem isValid={validations.hasUpper} text="Uppercase" />
                        <ValidationItem isValid={validations.hasSpecial} text="Special Character" />
                        <ValidationItem isValid={validations.hasLength} text="8+ Characters" />
                    </div>

                    <div>
                        <label className="block mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                        <input 
                            name="confirmPassword" 
                            type="password" 
                            placeholder="Re-type password"
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3.5 rounded-2xl bg-white/60 border border-white focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-800 placeholder-slate-400 shadow-sm"
                        />
                    </div>

                    {status === "error" && (
                        <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[11px] font-bold text-center uppercase tracking-tighter">
                            {message}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={status === "loading"}
                        className="w-full py-4 rounded-xl text-white font-black text-xs uppercase tracking-widest bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-xl shadow-blue-500/20 transition-all transform hover:-translate-y-0.5 mt-2"
                    >
                        {status === "loading" ? "Updating..." : "Establish New Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

/**
 * ValidationItem Helper
 */
const ValidationItem = ({ isValid, text }) => (
    <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-tight transition-colors duration-300 ${isValid ? "text-emerald-600" : "text-slate-300"}`}>
        <span className="text-[14px] leading-none">{isValid ? "✓" : "•"}</span>
        {text}
    </div>
);

export default ResetPassword;