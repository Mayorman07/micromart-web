import { useState, useEffect } from "react";
import api from "../../services/api"; // Centralized API instance replaces standard axios

/**
 * ProfileSettings Component
 * Manages administrative user details and account security preferences.
 * Interfaces with the Spring Boot user service via the centralized security interceptor.
 */
const ProfileSettings = () => {
    const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "" });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        /**
         * Fetches current administrator profile data on component mount.
         * Authorization headers are handled automatically by the api instance.
         */
        const fetchProfile = async () => {
            try {
                const adminEmail = "mayowa.hyde@gmail.com"; 
                const response = await api.get(`/users/users/view/${adminEmail}`);
                setFormData(response.data);
            } catch (error) {
                console.error("Profile Fetch Error: Access to administrative dossier interrupted.", error);
            }
        };
        fetchProfile();
    }, []);

    /**
     * Handles the update request for user profile information.
     * Persists changes to the backend via PutMapping(path ="/update").
     */
    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            /** * Targets the Spring Boot users/update endpoint.
             * The interceptor manages JWT rotation if the session expires during submission.
             */
            await api.put(`/users/users/update`, formData);
            alert("Profile updated successfully.");
        } catch (err) {
            console.error("Update Error:", err);
            // Standardizing error extraction from the backend response
            alert(err.response?.data?.message || "Failed to update profile. Please check your connection.");
        } finally { 
            setIsSaving(false); 
        }
    };

    const inputStyle = "w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500 outline-none transition-all";
    const labelStyle = "text-[10px] font-bold text-slate-500 uppercase tracking-widest";

    return (
        <div className="animate-in fade-in duration-500 space-y-8">
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">Account Settings</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* User Information Form */}
                <div className="md:col-span-2 bg-[#161b2c] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className={labelStyle}>First Name</label>
                                <input 
                                    className={inputStyle}
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className={labelStyle}>Last Name</label>
                                <input 
                                    className={inputStyle}
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className={labelStyle}>Email Address</label>
                            <input 
                                disabled
                                className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 text-slate-500 cursor-not-allowed font-mono text-sm"
                                value={formData.email}
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={isSaving}
                            className="px-10 py-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-[10px] font-black tracking-widest rounded-2xl transition-all shadow-lg shadow-cyan-900/20 uppercase"
                        >
                            {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                    </form>
                </div>

                {/* Account Security Information */}
                <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between">
                    <div>
                        <h3 className="text-white font-bold mb-4">Security Profile</h3>
                        <p className="text-slate-500 text-xs leading-relaxed">
                            Your account is secured with JWT-based session persistence and automated token rotation.
                        </p>
                    </div>
                    <div className="pt-6 border-t border-white/5 mt-6">
                        <div className="flex justify-between text-[10px] mb-4">
                            <span className="text-slate-500 uppercase font-bold tracking-widest">Account Status</span>
                            <span className="text-cyan-500 font-black uppercase">Verified</span>
                        </div>
                        <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white text-[10px] font-bold uppercase tracking-widest transition-all">
                            Reset Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;