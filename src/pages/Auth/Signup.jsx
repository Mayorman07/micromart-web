import { useState, useMemo } from "react";
import api from "../../services/api"; 
import { useNavigate } from "react-router-dom";
import LiquidBackgroundDeep from "../../components/LiquidBackgroundDeep";
import Snowfall from "../../components/Snowfall";
import { COUNTRIES } from "../../data/countries"; 
import { AlertCircle, ChevronDown, Lock } from "lucide-react";

/**
 * Signup Component
 * Handles the registration of new user entities within the MicroMart ecosystem.
 * Features a dynamic Password Strength Meter and pre-flight validation.
 */
const Signup = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        firstName: "", lastName: "", email: "", password: "",
        gender: "Male", mobileNumber: "",
        address: { street: "", city: "", state: "", country: "", zipCode: "" }
    });

    /**
     * Logic: Password Strength Calculation
     * Evaluates complexity to provide real-time UI feedback.
     */
    const passwordStrength = useMemo(() => {
        const pw = formData.password;
        if (!pw) return { score: 0, label: "", color: "bg-slate-200" };
        
        let score = 0;
        if (pw.length >= 3) score += 1; // Min backend requirement
        if (pw.length >= 8) score += 1; // Complexity bonus
        if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) score += 1; // Alpha-numeric bonus
        if (/[^A-Za-z0-9]/.test(pw)) score += 1; // Special char bonus
        
        const levels = [
            { score: 0, label: "Invalid", color: "bg-red-500/20" },
            { score: 1, label: "Weak", color: "bg-red-500" },
            { score: 2, label: "Medium", color: "bg-yellow-500" },
            { score: 3, label: "Strong", color: "bg-emerald-500" },
            { score: 4, label: "Elite", color: "bg-cyan-500" },
        ];
        
        return levels[score];
    }, [formData.password]);

    const validate = () => {
        let tempErrors = {};
        if (formData.firstName.length < 2) tempErrors.firstName = "Minimum 2 chars";
        if (formData.lastName.length < 2) tempErrors.lastName = "Minimum 2 chars";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) tempErrors.email = "Invalid format";
        if (formData.password.length < 3 || formData.password.length > 12) tempErrors.password = "3-12 characters";
        if (formData.mobileNumber.length < 11 || formData.mobileNumber.length > 15) tempErrors.mobileNumber = "11-15 digits";
        
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors({ ...errors, [name]: "" });
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            address: { ...formData.address, [name]: value }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setStatus("loading");
        try {
            await api.post("/users/users/create", formData);
            setStatus("success");
        } catch (error) {
            setStatus("error");
            setErrorMessage(error.response?.data?.message || "Registration failed.");
        }
    };

    // Adaptive Input Styles
    const inputStyle = (fieldName) => `w-full px-4 py-3.5 rounded-xl bg-slate-50/50 border transition-all font-medium outline-none ${errors[fieldName] ? 'border-red-400 focus:ring-4 focus:ring-red-50' : 'border-slate-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/5'} text-slate-800 placeholder:text-slate-300`;
    const labelStyle = "block text-[10px] font-black text-cyan-600/60 uppercase mb-2 ml-1 tracking-[0.2em]";

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans py-12">
            <LiquidBackgroundDeep />
            <Snowfall />

            <div className="relative z-10 w-full max-w-2xl bg-white/95 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-white/60 mx-4">
                <header className="text-center mb-12">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Create Account</h2>
                </header>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                    {/* PROFILE SECTOR */}
                    <div className="col-span-2 pb-2 border-b border-slate-100 mb-2 flex items-center gap-2">
                        <span className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">Profile Information</span>
                    </div>
                    
                    <div>
                        <label className={labelStyle}>First Name</label>
                        <input name="firstName" placeholder="First Name" onChange={handleChange} className={inputStyle('firstName')} />
                    </div>
                    <div>
                        <label className={labelStyle}>Last Name</label>
                        <input name="lastName" placeholder="Last Name" onChange={handleChange} className={inputStyle('lastName')} />
                    </div>
                    <div>
                        <label className={labelStyle}>Email Address</label>
                        <input name="email" type="email" placeholder="Email" onChange={handleChange} className={inputStyle('email')} />
                    </div>
                    <div>
                        <label className={labelStyle}>Mobile Number</label>
                        <input name="mobileNumber" placeholder="11-15 digits" onChange={handleChange} className={inputStyle('mobileNumber')} />
                    </div>

                    {/* PASSWORD SECTOR WITH STRENGTH BAR */}
                    <div className="col-span-2 space-y-2">
                        <label className={labelStyle}>Password (3-12 characters)</label>
                        <div className="relative">
                            <input 
                                name="password" 
                                type={showPassword ? "text" : "password"} 
                                placeholder="••••••••" 
                                onChange={handleChange} 
                                className={inputStyle('password')} 
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)} 
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[9px] font-black uppercase hover:text-cyan-600 transition-colors"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>

                        {/* 🎯 PASSWORD STRENGTH BAR */}
                        <div className="px-1 pt-1">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                                    Strength Status: <span className={passwordStrength.score > 0 ? 'text-slate-900' : 'text-red-500'}>{passwordStrength.label || 'None'}</span>
                                </span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
                                {[1, 2, 3, 4].map((step) => (
                                    <div 
                                        key={step}
                                        className={`h-full flex-1 transition-all duration-700 ${
                                            step <= passwordStrength.score ? passwordStrength.color : 'bg-slate-100'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ADDRESS SECTOR */}
                    <div className="col-span-2 pb-2 border-b border-slate-100 mt-6 mb-2">
                        <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">Primary Address</h3>
                    </div>
                    
                    <div className="col-span-2">
                        <label className={labelStyle}>Street Address</label>
                        <input name="street" placeholder="123 Business Way" onChange={handleAddressChange} className={inputStyle('street')} />
                    </div>

                    <div className="relative">
                        <label className={labelStyle}>Country</label>
                        <select name="country" onChange={handleAddressChange} className={inputStyle('country')} value={formData.address.country}>
                            <option value="" disabled>Select Country</option>
                            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <ChevronDown className="absolute right-4 top-[42px] text-slate-400 pointer-events-none" size={14} />
                    </div>

                    <div>
                        <label className={labelStyle}>City</label>
                        <input name="city" placeholder="City" onChange={handleAddressChange} className={inputStyle('city')} />
                    </div>

                    <div className="col-span-2 mt-10">
                        {status === "error" && (
                            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-[10px] font-bold text-center uppercase border border-red-100 flex items-center justify-center gap-2">
                                <AlertCircle size={14} /> {errorMessage}
                            </div>
                        )}
                        <button 
                            type="submit" 
                            disabled={status === "loading"}
                            className="w-full py-5 rounded-2xl font-black text-white text-[11px] uppercase tracking-[0.3em] shadow-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:scale-[1.01] transition-all active:scale-95 disabled:opacity-50 shadow-cyan-500/20"
                        >
                            {status === "loading" ? "Initializing Registry..." : "Create Account"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;