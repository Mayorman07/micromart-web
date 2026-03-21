import { useState, useMemo } from "react";
import api from "../../services/api"; 
import { useNavigate } from "react-router-dom";
import LiquidBackgroundDeep from "../../components/LiquidBackgroundDeep";
import Snowfall from "../../components/Snowfall";
import { COUNTRIES } from "../../data/countries"; 
import { AlertCircle, ChevronDown } from "lucide-react";

/**
 * Signup Component
 * Handles the registration of new user entities.
 * Includes synchronized XSS-prevention regex, strict length validation, 
 * and a configuration-driven validation engine.
 */
const Signup = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        firstName: "", lastName: "", email: "", password: "",
        gender: "MALE", mobileNumber: "",
        address: { street: "", city: "", state: "", country: "", zipCode: "" }
    });

    /**
     * Password Strength Calculation
     * Recalibrated for the 8-character minimum security baseline.
     */
    const passwordStrength = useMemo(() => {
        const pw = formData.password;
        if (!pw) return { score: 0, label: "", color: "bg-slate-200" };
        
        let score = 0;
        if (pw.length >= 8) score += 1; 
        if (pw.length >= 12) score += 1; 
        if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) score += 1; 
        if (/[^A-Za-z0-9]/.test(pw)) score += 1; 
        
        const levels = [
            { score: 0, label: "Invalid (< 8 chars)", color: "bg-red-500/20" },
            { score: 1, label: "Weak", color: "bg-red-500" },
            { score: 2, label: "Medium", color: "bg-yellow-500" },
            { score: 3, label: "Strong", color: "bg-emerald-500" },
            { score: 4, label: "Elite", color: "bg-cyan-500" },
        ];
        
        return levels[score];
    }, [formData.password]);

    /**
     * Client-Side Form Validation
     * Uses a configuration-driven approach to eliminate repetitive if-statements.
     */
    const validate = () => {
        const tempErrors = {};
        
        // Regex Patterns (Unicode enabled for international characters)
        const safeTextRegex = /^[\p{L}\p{N}\s\-.,'#&/]+$/u;
        const phoneRegex = /^\+?[0-9]{11,15}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Core validation engine
        const validateField = (value, rules) => {
            if (rules.required && !value) return "Required field";
            if (value) {
                if (rules.min && value.length < rules.min) return `Min ${rules.min} characters`;
                if (rules.max && value.length > rules.max) return `Max ${rules.max} characters`;
                if (rules.regex && !rules.regex.test(value)) return rules.regexMsg || "Invalid format";
            }
            return null;
        };

        // Rule definitions for primary fields
        const fieldRules = {
            firstName: { required: true, min: 2, max: 50, regex: safeTextRegex, regexMsg: "Invalid characters detected" },
            lastName: { required: true, min: 2, max: 50, regex: safeTextRegex, regexMsg: "Invalid characters detected" },
            email: { required: true, regex: emailRegex, regexMsg: "Invalid email format" },
            mobileNumber: { required: true, regex: phoneRegex, regexMsg: "11-15 digits required" },
            password: { required: true, min: 8, max: 64 }
        };

        // Execute validation on primary fields
        Object.keys(fieldRules).forEach(key => {
            const error = validateField(formData[key], fieldRules[key]);
            if (error) tempErrors[key] = error;
        });

        // Execute validation on nested address fields
        if (formData.address.street && !safeTextRegex.test(formData.address.street)) {
            tempErrors.street = "Invalid characters detected";
        }
        if (formData.address.city && !safeTextRegex.test(formData.address.city)) {
            tempErrors.city = "Invalid characters detected";
        }

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
        if (errors[name]) setErrors({ ...errors, [name]: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        
        setStatus("loading");
        try {
            await api.post("/users/users/create", formData);
            setStatus("success");
            setTimeout(() => navigate("/login"), 1500);
        } catch (error) {
            setStatus("error");
            setErrorMessage(error.response?.data?.message || "Registration failed. Verify input parameters.");
        }
    };

    // UI Configuration
    const inputStyle = (fieldName) => `w-full px-4 py-3.5 rounded-xl bg-slate-50/50 border transition-all font-medium outline-none ${errors[fieldName] ? 'border-red-400 focus:ring-4 focus:ring-red-50 text-red-900' : 'border-slate-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/5 text-slate-800'} placeholder:text-slate-300`;
    const labelStyle = "block text-[10px] font-black text-cyan-600/60 uppercase mb-2 ml-1 tracking-[0.2em]";
    
    // Inline Error Component
    const ErrorFeedback = ({ fieldName }) => {
        if (!errors[fieldName]) return null;
        return <p className="text-[9px] font-black text-red-500 uppercase tracking-wider mt-1 ml-1">{errors[fieldName]}</p>;
    };

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
                        <ErrorFeedback fieldName="firstName" />
                    </div>
                    <div>
                        <label className={labelStyle}>Last Name</label>
                        <input name="lastName" placeholder="Last Name" onChange={handleChange} className={inputStyle('lastName')} />
                        <ErrorFeedback fieldName="lastName" />
                    </div>
                    <div>
                        <label className={labelStyle}>Email Address</label>
                        <input name="email" type="email" placeholder="Email" onChange={handleChange} className={inputStyle('email')} />
                        <ErrorFeedback fieldName="email" />
                    </div>
                    <div>
                        <label className={labelStyle}>Mobile Number</label>
                        <input name="mobileNumber" placeholder="11-15 digits" onChange={handleChange} className={inputStyle('mobileNumber')} />
                        <ErrorFeedback fieldName="mobileNumber" />
                    </div>

                    {/* PASSWORD SECTOR */}
                    <div className="col-span-2 space-y-2 mt-2">
                        <label className={labelStyle}>Password (Min 8 characters)</label>
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
                        <ErrorFeedback fieldName="password" />

                        {/* STRENGTH INDICATOR */}
                        <div className="px-1 pt-2">
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
                        <ErrorFeedback fieldName="street" />
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
                        <ErrorFeedback fieldName="city" />
                    </div>

                    {/* SUBMISSION CONTROL */}
                    <div className="col-span-2 mt-8">
                        {status === "error" && (
                            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-[10px] font-bold text-center uppercase border border-red-100 flex items-center justify-center gap-2">
                                <AlertCircle size={14} /> {errorMessage}
                            </div>
                        )}
                        {status === "success" && (
                            <div className="mb-6 p-4 rounded-xl bg-emerald-50 text-emerald-600 text-[10px] font-bold text-center uppercase border border-emerald-100">
                                Registration Successful. Initializing redirect...
                            </div>
                        )}
                        <button 
                            type="submit" 
                            disabled={status === "loading" || status === "success"}
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