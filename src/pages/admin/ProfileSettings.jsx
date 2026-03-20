import { useState, useEffect, useMemo } from "react";
import api from "../../services/api";
import { useToast } from "../../contexts/ToastContext";
import { Loader2, ShieldCheck, MapPin, User as UserIcon, Eye, EyeOff, AlertCircle } from "lucide-react";

/**
 * ProfileSettings Component
 * Comprehensive user registry management with pre-flight validation.
 */
const ProfileSettings = () => {
    const { showToast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({}); // 🎯 Tracks validation states

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
     * Logic: Pre-flight Validation
     * Matches the constraints defined in the Spring Boot DTOs.
     */
    const validateForm = () => {
        const newErrors = {};
        
        if (formData.firstName.length < 2) newErrors.firstName = "Minimum 2 characters required";
        if (formData.lastName.length < 2) newErrors.lastName = "Minimum 2 characters required";
        
        // Only validate password length if the user actually typed something
        if (formData.password.length > 0 && (formData.password.length < 3 || formData.password.length > 12)) {
            newErrors.password = "Must be between 3 and 12 characters";
        }

        if (formData.mobileNumber.length < 11 || formData.mobileNumber.length > 15) {
            newErrors.mobileNumber = "Requires 11-15 digits";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

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
            { score: 2, label: "Fair", color: "bg-yellow-500" },
            { score: 3, label: "Strong", color: "bg-emerald-500" },
            { score: 4, label: "Elite", color: "bg-cyan-500" },
        ];
        return levels[score];
    }, [formData.password]);

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
        
        // 🎯 Run validation before attempting API call
        if (!validateForm()) {
            showToast("Registry update blocked: check field constraints", "error");
            return;
        }

        setIsSaving(true);
        const payload = { ...formData };
        if (!payload.password || payload.password.trim() === "") {
            delete payload.password;
        }

        try {
            await api.put(`/users/users/update`, payload);
            showToast("Profile successfully synchronized", "success");
            setShowPassword(false);
            setErrors({}); // Clear errors on success
        } catch (err) {
            showToast(err.response?.data?.message || "Registry update rejected", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const inputBase = "w-full bg-black/40 border rounded-2xl p-4 text-white focus:border-cyan-500 outline-none transition-all placeholder:text-white/10";
    const labelStyle = "text-[10px] font-bold text-slate-500 uppercase tracking-widest";
    
    // Helper to render error message
    const ErrorLabel = ({ field }) => errors[field] ? (
        <span className="text-[9px] text-red-500 font-bold flex items-center gap-1 mt-1 animate-in fade-in slide-in-from-left-1">
            <AlertCircle size={10} /> {errors[field]}
        </span>
    ) : null;

    if (loading) return <div className="flex flex-col items-center justify-center py-20 gap-4"><Loader2 className="animate-spin text-cyan-500" size={32} /></div>;

    return (
        <div className="animate-in fade-in duration-500 space-y-8 pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">Account Settings</h1>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Registry Synchronization</p>
                </div>
                <button 
                    onClick={handleUpdate}
                    disabled={isSaving}
                    className="px-10 py-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-[10px] font-black tracking-widest rounded-2xl transition-all shadow-xl uppercase"
                >
                    {isSaving ? "Synchronizing..." : "Save Changes"}
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* IDENTITY DATA */}
                    <section className="bg-[#161b2c] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
                        <div className="flex items-center gap-3 mb-8">
                            <UserIcon className="text-cyan-500" size={18} />
                            <h3 className="text-white font-bold uppercase text-xs tracking-widest">Personal Identification</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className={labelStyle}>First Name</label>
                                <input 
                                    className={`${inputBase} ${errors.firstName ? 'border-red-500/50' : 'border-white/10'}`} 
                                    value={formData.firstName} 
                                    onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
                                />
                                <ErrorLabel field="firstName" />
                            </div>
                            <div className="space-y-2">
                                <label className={labelStyle}>Last Name</label>
                                <input 
                                    className={`${inputBase} ${errors.lastName ? 'border-red-500/50' : 'border-white/10'}`} 
                                    value={formData.lastName} 
                                    onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
                                />
                                <ErrorLabel field="lastName" />
                            </div>
                            <div className="space-y-2">
                                <label className={labelStyle}>Mobile Connection</label>
                                <input 
                                    className={`${inputBase} ${errors.mobileNumber ? 'border-red-500/50' : 'border-white/10'}`} 
                                    value={formData.mobileNumber} 
                                    onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})} 
                                />
                                <ErrorLabel field="mobileNumber" />
                            </div>
                            
                            <div className="space-y-2">
                                <label className={labelStyle}>New Password (3-12 characters)</label>
                                <div className="relative group">
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        className={`${inputBase} pr-12 ${errors.password ? 'border-red-500/50' : 'border-white/10'}`} 
                                        value={formData.password} 
                                        onChange={(e) => setFormData({...formData, password: e.target.value})} 
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-500"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <ErrorLabel field="password" />
                                {formData.password.length > 0 && (
                                    <div className="px-1 pt-2 animate-in fade-in duration-300">
                                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden flex gap-1">
                                            {[1, 2, 3, 4].map((step) => (
                                                <div key={step} className={`h-full flex-1 transition-all duration-700 ${step <= passwordStrength.score ? passwordStrength.color : 'bg-white/5'}`} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* ADDRESS REGISTRY */}
                    <section className="bg-[#161b2c] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
                        <div className="flex items-center gap-3 mb-8">
                            <MapPin className="text-cyan-500" size={18} />
                            <h3 className="text-white font-bold uppercase text-xs tracking-widest">Logistics Registry</h3>
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

                <div className="space-y-6">
                    <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8">
                        <ShieldCheck className="text-cyan-500 mb-4" size={32} />
                        <h3 className="text-white font-bold mb-2 uppercase text-xs tracking-widest">Protocol Matrix</h3>
                        <p className="text-slate-500 text-[11px] leading-relaxed"> Registry synchronization is guarded by layer-7 encryption and local validation checks to prevent identity conflicts. </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;