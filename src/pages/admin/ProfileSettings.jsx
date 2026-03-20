import { useState, useEffect, useMemo } from "react";
import api from "../../services/api";
import { useToast } from "../../contexts/ToastContext";
import { useTheme } from "../../contexts/ThemeContext";
import { 
    Loader2, ShieldCheck, MapPin, User as UserIcon, 
    Eye, EyeOff, AlertCircle, Lock, ChevronDown 
} from "lucide-react";

/**
 * ProfileSettings Component
 * Comprehensive user registry management with adaptive UI.
 * Features: Payload sanitization, strength metering, and pre-flight validation.
 */
const ProfileSettings = () => {
    const { showToast } = useToast();
    const { isDark } = useTheme();
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    // Master state for UpdateUserRequest DTO
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobileNumber: "",
        gender: "",
        password: "", 
        address: {
            street: "",
            city: "",
            state: "",
            country: "",
            zipCode: ""
        }
    });

    /**
     * Logic: Dynamic UI Styling
     * Switches classes based on isDark context for a native experience.
     */
    const sectionClass = `border rounded-[2.5rem] p-10 transition-all duration-500 ${
        isDark ? 'bg-[#161b2c] border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-sm'
    }`;

    const inputBase = `w-full border rounded-2xl p-4 transition-all outline-none ${
        isDark 
        ? 'bg-black/40 border-white/10 text-white focus:border-cyan-500 placeholder:text-white/10' 
        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-cyan-600 focus:bg-white placeholder:text-gray-300'
    }`;

    const labelStyle = `text-[10px] font-black uppercase tracking-[0.2em] ${
        isDark ? 'text-slate-500' : 'text-gray-400'
    }`;

    /**
     * Logic: Password Strength Calculation
     * 1-4 scale mirroring the Signup registry security.
     */
    const passwordStrength = useMemo(() => {
        const pw = formData.password;
        if (!pw) return { score: 0, label: "Neutral", color: "bg-white/5" };
        
        let score = 0;
        if (pw.length >= 3) score += 1;
        if (pw.length >= 8) score += 1;
        if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) score += 1;
        if (/[^A-Za-z0-9]/.test(pw)) score += 1;
        
        const levels = [
            { score: 0, label: "Invalid", color: "bg-red-500/20" },
            { score: 1, label: "Weak", color: "bg-red-500" },
            { score: 2, label: "Medium", color: "bg-yellow-500" },
            { score: 3, label: "Strong", color: "bg-emerald-500" },
            { score: 4, label: "Elite", color: "bg-cyan-500" },
        ];
        
        return levels[score];
    }, [formData.password]);

    /**
     * Logic: Pre-flight Validation
     * Synchronized with Spring Boot @Size constraints.
     */
    const validateForm = () => {
        const newErrors = {};
        if (formData.firstName.length < 2) newErrors.firstName = "Minimum 2 characters";
        if (formData.lastName.length < 2) newErrors.lastName = "Minimum 2 characters";
        
        // Optional password validation (only if field is not empty)
        if (formData.password.length > 0 && (formData.password.length < 3 || formData.password.length > 12)) {
            newErrors.password = "Range: 3-12 characters";
        }
        
        if (formData.mobileNumber.length < 11 || formData.mobileNumber.length > 15) {
            newErrors.mobileNumber = "Requires 11-15 digits";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userEmail = localStorage.getItem("userEmail") || "mayowa.hyde@gmail.com";
                const response = await api.get(`/users/users/view/${userEmail}`);
                const data = response.data;
                
                setFormData({
                    ...data,
                    password: "", 
                    address: data.address || { street: "", city: "", state: "", country: "", zipCode: "" }
                });
            } catch (error) {
                showToast("Registry Access Interrupted", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [showToast]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            showToast("Update blocked: validation failure", "error");
            return;
        }

        setIsSaving(true);
        const payload = { ...formData };

        // Sanitization: Remove empty password to bypass backend @Size constraint
        if (!payload.password || payload.password.trim() === "") {
            delete payload.password;
        }

        try {
            await api.put(`/users/users/update`, payload);
            showToast("Registry synchronized successfully", "success");
            setErrors({});
            setShowPassword(false);
        } catch (err) {
            showToast(err.response?.data?.message || "Registry update rejected", "error");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className={`animate-spin ${isDark ? 'text-cyan-500' : 'text-cyan-600'}`} size={32} />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">Decrypting Registry...</p>
        </div>
    );

    return (
        <div className="animate-in fade-in duration-500 space-y-8 pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className={`text-4xl font-black uppercase tracking-tighter italic ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Account Settings
                    </h1>
                    <p className={`${isDark ? 'text-slate-500' : 'text-gray-400'} text-[10px] font-bold uppercase tracking-widest mt-1`}>
                        Registry Synchronization Mode
                    </p>
                </div>
                <button 
                    onClick={handleUpdate}
                    disabled={isSaving}
                    className={`px-10 py-4 text-white text-[10px] font-black tracking-widest rounded-2xl transition-all shadow-xl uppercase 
                        ${isDark ? 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-900/20' : 'bg-cyan-600 hover:bg-cyan-700 shadow-cyan-200'}`}
                >
                    {isSaving ? "Synchronizing..." : "Save Changes"}
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* PERSONAL IDENTIFICATION */}
                    <section className={sectionClass}>
                        <div className="flex items-center gap-3 mb-8">
                            <UserIcon className={isDark ? "text-cyan-500" : "text-cyan-600"} size={18} />
                            <h3 className={`${isDark ? 'text-white' : 'text-gray-900'} font-black uppercase text-xs tracking-[0.2em]`}>
                                Personal Identification
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className={labelStyle}>First Name</label>
                                <input 
                                    className={`${inputBase} ${errors.firstName ? 'border-red-500' : ''}`} 
                                    value={formData.firstName} 
                                    onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
                                />
                                {errors.firstName && <span className="text-[9px] text-red-500 font-bold uppercase">{errors.firstName}</span>}
                            </div>
                            <div className="space-y-2">
                                <label className={labelStyle}>Last Name</label>
                                <input 
                                    className={`${inputBase} ${errors.lastName ? 'border-red-500' : ''}`} 
                                    value={formData.lastName} 
                                    onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
                                />
                                {errors.lastName && <span className="text-[9px] text-red-500 font-bold uppercase">{errors.lastName}</span>}
                            </div>
                            <div className="space-y-2">
                                <label className={labelStyle}>Mobile Connection</label>
                                <input 
                                    className={`${inputBase} ${errors.mobileNumber ? 'border-red-500' : ''}`} 
                                    value={formData.mobileNumber} 
                                    onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})} 
                                />
                                {errors.mobileNumber && <span className="text-[9px] text-red-500 font-bold uppercase">{errors.mobileNumber}</span>}
                            </div>
                            
                            <div className="space-y-2">
                                <label className={labelStyle}>Rotate Password (Optional)</label>
                                <div className="relative">
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        placeholder="New Secret Key"
                                        className={`${inputBase} pr-12 ${errors.password ? 'border-red-500' : ''}`} 
                                        value={formData.password} 
                                        onChange={(e) => setFormData({...formData, password: e.target.value})} 
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-slate-500 hover:text-cyan-500' : 'text-gray-300 hover:text-cyan-600'}`}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && <span className="text-[9px] text-red-500 font-bold uppercase">{errors.password}</span>}
                                {formData.password.length > 0 && (
                                    <div className="h-1 w-full bg-black/10 dark:bg-white/5 rounded-full overflow-hidden flex gap-1 mt-3 transition-all">
                                        {[1, 2, 3, 4].map((step) => (
                                            <div key={step} className={`h-full flex-1 transition-all duration-700 ${step <= passwordStrength.score ? passwordStrength.color : 'opacity-20'}`} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* LOGISTICS REGISTRY */}
                    <section className={sectionClass}>
                        <div className="flex items-center gap-3 mb-8">
                            <MapPin className={isDark ? "text-cyan-500" : "text-cyan-600"} size={18} />
                            <h3 className={`${isDark ? 'text-white' : 'text-gray-900'} font-black uppercase text-xs tracking-[0.2em]`}>
                                Address
                            </h3>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className={labelStyle}>Street Address</label>
                                <input className={inputBase} value={formData.address.street} onChange={(e) => setFormData({...formData, address: {...formData.address, street: e.target.value}})} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2"><label className={labelStyle}>City</label><input className={inputBase} value={formData.address.city} onChange={(e) => setFormData({...formData, address: {...formData.address, city: e.target.value}})} /></div>
                                <div className="space-y-2"><label className={labelStyle}>State</label><input className={inputBase} value={formData.address.state} onChange={(e) => setFormData({...formData, address: {...formData.address, state: e.target.value}})} /></div>
                                <div className="space-y-2"><label className={labelStyle}>Zip Code</label><input className={inputBase} value={formData.address.zipCode} onChange={(e) => setFormData({...formData, address: {...formData.address, zipCode: e.target.value}})} /></div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* PROTOCOL SIDEBAR */}
                <div className="space-y-6">
                    <div className={`${isDark ? 'bg-slate-900/50 border-white/5 shadow-2xl' : 'bg-gray-50 border-gray-100 shadow-sm'} border rounded-[2.5rem] p-8 transition-all`}>
                        <ShieldCheck className={isDark ? "text-cyan-500" : "text-cyan-600"} size={32} />
                        <h3 className={`${isDark ? 'text-white' : 'text-gray-900'} font-black mb-2 uppercase text-xs tracking-widest mt-4`}>Security Protocol</h3>
                        <p className={`${isDark ? 'text-slate-500' : 'text-gray-500'} text-[11px] leading-relaxed font-medium`}>
                            Administrative synchronization is active. All identity updates are propagated via secure relay. Password rotation requires a 3-12 character complex string.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;