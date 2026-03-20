import { useState, useEffect } from "react";
import api from "../../services/api";
import { useToast } from "../../contexts/ToastContext";
import { Loader2, ShieldCheck, MapPin, User as UserIcon } from "lucide-react";

/**
 * ProfileSettings Component
 * Manages user identity and logistics (address) registry.
 * Implements payload sanitization to handle optional password updates
 * without triggering backend @Size validation constraints.
 */
const ProfileSettings = () => {
    const { showToast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    // Initial state matching the UpdateUserRequest DTO structure
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
     * Effect: Retrieve current user profile from the centralized service.
     */
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userEmail = localStorage.getItem("userEmail") || "mayowa.hyde@gmail.com";
                const response = await api.get(`/users/users/view/${userEmail}`);
                const data = response.data;
                
                // Initialize form with fetched data; handle null address gracefully
                setFormData({
                    ...data,
                    password: "", 
                    address: data.address || { street: "", city: "", state: "", country: "", zipCode: "" }
                });
            } catch (error) {
                showToast("Failed to load profile from registry", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [showToast]);

    /**
     * Logic: Persist changes to the user registry.
     * Sanitizes the payload to remove empty strings from sensitive fields
     * to avoid triggering @Size validation errors on the Spring Boot backend.
     */
    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        // Create sanitized payload clone
        const payload = { ...formData };

        // Logic: Remove password key if empty to avoid @Size [3-12] violation
        if (!payload.password || payload.password.trim() === "") {
            delete payload.password;
        }

        try {
            // FIX: Ensure 'payload' is sent, not the raw 'formData'
            await api.put(`/users/users/update`, payload);
            showToast("Profile and Shipping Registry updated successfully", "success");
        } catch (err) {
            // Standardized error extraction
            const errorMessage = err.response?.data?.message || "Registry update rejected";
            showToast(errorMessage, "error");
        } finally {
            setIsSaving(false);
        }
    };

    const inputStyle = "w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500 outline-none transition-all placeholder:text-white/20";
    const labelStyle = "text-[10px] font-bold text-slate-500 uppercase tracking-widest";

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-cyan-500" size={32} />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Accessing Registry...</p>
        </div>
    );

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
                    className="px-10 py-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-[10px] font-black tracking-widest rounded-2xl transition-all shadow-xl shadow-cyan-900/20 uppercase"
                >
                    {isSaving ? "Synchronizing..." : "Save Changes"}
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* IDENTITY DATA SECTION */}
                    <section className="bg-[#161b2c] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
                        <div className="flex items-center gap-3 mb-8">
                            <UserIcon className="text-cyan-500" size={18} />
                            <h3 className="text-white font-bold uppercase text-xs tracking-widest">Personal Identification</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className={labelStyle}>First Name</label>
                                <input className={inputStyle} value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <label className={labelStyle}>Last Name</label>
                                <input className={inputStyle} value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <label className={labelStyle}>Mobile Number</label>
                                <input className={inputStyle} value={formData.mobileNumber} onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <label className={labelStyle}>New Password (Optional)</label>
                                <input type="password" placeholder="Leave blank to keep current" className={inputStyle} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                            </div>
                        </div>
                    </section>

                    {/* ADDRESS DATA SECTION */}
                    <section className="bg-[#161b2c] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
                        <div className="flex items-center gap-3 mb-8">
                            <MapPin className="text-cyan-500" size={18} />
                            <h3 className="text-white font-bold uppercase text-xs tracking-widest">Address</h3>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className={labelStyle}>Street Address</label>
                                <input className={inputStyle} value={formData.address.street} onChange={(e) => setFormData({...formData, address: {...formData.address, street: e.target.value}})} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className={labelStyle}>City</label>
                                    <input className={inputStyle} value={formData.address.city} onChange={(e) => setFormData({...formData, address: {...formData.address, city: e.target.value}})} />
                                </div>
                                <div className="space-y-2">
                                    <label className={labelStyle}>State</label>
                                    <input className={inputStyle} value={formData.address.state} onChange={(e) => setFormData({...formData, address: {...formData.address, state: e.target.value}})} />
                                </div>
                                <div className="space-y-2">
                                    <label className={labelStyle}>Zip Code</label>
                                    <input className={inputStyle} value={formData.address.zipCode} onChange={(e) => setFormData({...formData, address: {...formData.address, zipCode: e.target.value}})} />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* SECURITY STATUS PANEL */}
                <div className="space-y-6">
                    <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8">
                        <ShieldCheck className="text-cyan-500 mb-4" size={32} />
                        <h3 className="text-white font-bold mb-2 uppercase text-xs tracking-widest">Security Protocol</h3>
                        <p className="text-slate-500 text-[11px] leading-relaxed">
                            Partial registry updates are active. Sensitive credentials are only transmitted during intentional password rotation to ensure maximum data integrity.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;