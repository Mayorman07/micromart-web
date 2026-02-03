// src/pages/Auth/ResetPassword.jsx
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Snowfall from "../../components/Snowfall"; 

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    const [passwords, setPasswords] = useState({ newPassword: "", confirmPassword: "" });
    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Regex Validations
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validations.hasLower || !validations.hasUpper || !validations.hasSpecial || !validations.hasLength) {
            setMessage("Password does not meet complexity requirements.");
            setStatus("error");
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            setMessage("Passwords do not match!");
            setStatus("error");
            return;
        }

        setStatus("loading");

        try {
            await axios.post("http://127.0.0.1:7082/users/password-reset/reset", {
                token: token,
                newPassword: passwords.newPassword
            });
            setStatus("success");
        } catch (error) {
            setStatus("error");
            setMessage(error.response?.data?.message || "Link expired or invalid.");
        }
    };

    // ✅ Success State
    if (status === "success") {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#00f2fe] to-[#4facfe] relative overflow-hidden font-sans">
                <Snowfall />
                <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/50 text-center mx-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <span className="text-3xl">✅</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Password Reset!</h2>
                    <p className="text-slate-500 mb-6">You can now login with your new password.</p>
                    <button 
                        onClick={() => navigate("/login")}
                        className="w-full py-3 rounded-xl text-white font-bold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/30 transition-all"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    // 📝 Reset Form State
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#00f2fe] to-[#4facfe] relative overflow-hidden font-sans py-10">
            <Snowfall />
            
            <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/50 text-center mx-4">
                <h2 className="text-3xl font-bold text-slate-800 mb-6">Reset Password</h2>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
                    
                    {/* New Password with Eye Icon */}
                    <div className="relative">
                        <label className="block mb-1 text-slate-700 font-semibold text-xs uppercase tracking-wide">New Password</label>
                        <input 
                            name="newPassword" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Enter new password"
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/40 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-700 placeholder-slate-400 pr-10"
                        />
                         <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-8 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                    </div>

                    {/* Dynamic Validation Checklist */}
                    <div className="grid grid-cols-2 gap-2 mb-2">
                        <ValidationItem isValid={validations.hasLower} text="Lowercase" />
                        <ValidationItem isValid={validations.hasUpper} text="Uppercase" />
                        <ValidationItem isValid={validations.hasSpecial} text="Special char" />
                        <ValidationItem isValid={validations.hasLength} text="8+ chars" />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block mb-1 text-slate-700 font-semibold text-xs uppercase tracking-wide">Confirm Password</label>
                        <input 
                            name="confirmPassword" 
                            type="password" 
                            placeholder="Confirm new password"
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/40 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-700 placeholder-slate-400"
                        />
                    </div>

                    {status === "error" && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm font-medium text-center">
                            ⚠️ {message}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={status === "loading"}
                        className="w-full py-3.5 rounded-xl text-white font-bold text-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 mt-2"
                    >
                        {status === "loading" ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

// Helper Component for checklist (Tailwind version)
const ValidationItem = ({ isValid, text }) => (
    <div className={`flex items-center gap-2 text-xs font-medium transition-colors duration-300 ${isValid ? "text-green-600" : "text-slate-400"}`}>
        <span>{isValid ? "✓" : "•"}</span>
        {text}
    </div>
);

export default ResetPassword;