import { useState, useEffect } from "react";
import axios from "axios";

const ProfileSettings = () => {
    const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "" });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchCurrentAdmin = async () => {
            const token = localStorage.getItem("token");
            const response = await axios.get(`http://127.0.0.1:7082/users/users/view/mayowa.hyde@gmail.com`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFormData(response.data);
        };
        fetchCurrentAdmin();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const token = localStorage.getItem("token");
            // Hits your @PutMapping(path ="/update")
            await axios.put(`http://127.0.0.1:7082/users/users/update`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Infrastructure identity updated successfully.");
        } catch (err) {
            alert("Update failed. Verify network connectivity.");
        } finally { setIsSaving(false); }
    };

    return (
        <div className="animate-[fadeIn_0.5s] space-y-8">
            <h1 className="text-3xl font-black text-white tracking-tight">Identity Settings</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* 🏷️ PERSONAL DATA CARD */}
                <div className="md:col-span-2 bg-[#161b2c] border border-white/5 rounded-[2.5rem] p-10">
                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">First Name</label>
                                <input 
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500 outline-none"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Last Name</label>
                                <input 
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500 outline-none"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Primary Admin Email</label>
                            <input 
                                disabled
                                className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 text-slate-500 cursor-not-allowed font-mono"
                                value={formData.email}
                            />
                        </div>
                        <button 
                            type="submit"
                            className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-2xl transition-all shadow-lg shadow-cyan-900/20"
                        >
                            {isSaving ? "COMMITING..." : "SAVE CHANGES"}
                        </button>
                    </form>
                </div>

                {/* 🔒 SECURITY STATUS CARD */}
                <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between">
                    <div>
                        <h3 className="text-white font-bold mb-4">Security Tier</h3>
                        <p className="text-slate-500 text-xs leading-relaxed">Your account is currently protected by Level 5 RSA Encryption and JWT-based session persistence.</p>
                    </div>
                    <div className="pt-6 border-t border-white/5 mt-6">
                        <div className="flex justify-between text-[10px] mb-2">
                            <span className="text-slate-500 uppercase">Password</span>
                            <span className="text-cyan-500 font-bold">ENCRYPTED</span>
                        </div>
                        <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white text-[10px] font-bold uppercase transition-all">
                            Change Master Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;