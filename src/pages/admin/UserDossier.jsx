import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UserDossier = () => {
    const { email } = useParams();
    const navigate = useNavigate();
    
    // State Management
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOperativeData();
    }, [email]);

    const fetchOperativeData = async () => {
        setLoading(true);
        try {
            // 🔑 Retrieve the token saved during AdminLogin
            const token = localStorage.getItem("token"); 

            // Hits your @GetMapping(path ="/view/{email}")
            const response = await axios.get(`http://127.0.0.1:7082/users/users/view/${email}`, {
                headers: {
                    // 🛡️ Passing the JWT so backend identifies you as ADMIN with user:READ
                    Authorization: `Bearer ${token}` 
                }
            });
            setUser(response.data);
            setError(null);
        } catch (err) {
            console.error("Dossier Retrieval Failed", err);
            // Handle Permission vs Not Found errors
            if (err.response?.status === 403) {
                setError("ACCESS_DENIED: INSUFFICIENT_CLEARANCE");
            } else {
                setError("OPERATIVE_NOT_FOUND_IN_REGISTRY");
            }
        } finally {
            setLoading(false);
        }
    };

    const promoteOperative = async () => {
        setIsUpdating(true);
        try {
            const token = localStorage.getItem("token");
            // Hits your @PutMapping("/{userId}/roles/manager")
            await axios.put(`http://127.0.0.1:7082/users/users/${email}/roles/manager`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Operative promoted to Manager status. Matrix recalibrated.");
            fetchOperativeData(); // Refresh pulse
        } catch (error) {
            alert("Authorization failed. Root Admin privileges required.");
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh]">
            <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-mono text-[10px] tracking-[0.3em] uppercase">Decrypting Profile...</p>
        </div>
    );

    if (error) return (
        <div className="p-10 bg-red-900/10 border border-red-500/20 rounded-[2rem] text-center">
            <h2 className="text-red-500 font-black text-xl mb-2">SYSTEM ERROR</h2>
            <p className="text-red-400/70 font-mono text-xs mb-6">{error}</p>
            <button 
                onClick={() => navigate("/admin/dashboard")}
                className="px-6 py-2 bg-red-500 text-white text-xs font-bold rounded-xl hover:bg-red-400 transition-all"
            >
                Return to Mission Control
            </button>
        </div>
    );

    return (
        <div className="animate-[fadeIn_0.5s_ease-out] space-y-8 pb-20">
            
            {/* 🧭 NAVIGATION HEADER */}
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div className="flex items-center gap-4 text-slate-500 text-sm">
                    <button onClick={() => navigate("/admin/dashboard")} className="hover:text-white transition-colors font-medium">Mission Control</button>
                    <span className="opacity-30">/</span>
                    <span className="text-cyan-400 font-bold tracking-widest text-xs uppercase">Operative Dossier</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* 👤 IDENTITY CARD */}
                <div className="md:col-span-4 space-y-6">
                    <div className="bg-[#161b2c] border border-white/5 rounded-[3rem] p-10 text-center relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-cyan-500/10 to-transparent"></div>
                        
                        <div className="relative z-10">
                            <div className="w-32 h-32 bg-slate-900 rounded-full mx-auto mb-6 border-4 border-[#161b2c] shadow-[0_0_30px_rgba(0,0,0,0.5)] flex items-center justify-center text-4xl font-black text-white">
                                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                            </div>
                            
                            <h2 className="text-3xl font-black text-white tracking-tight">
                                {user.firstName} {user.lastName}
                            </h2>
                            <p className="text-cyan-500 font-mono text-xs mt-2 tracking-widest uppercase">ID: {user.userId?.substring(0,8)}</p>
                        </div>
                    </div>
                </div>

                {/* 🛡️ AUTHORIZATION MATRIX */}
                <div className="md:col-span-8 space-y-8">
                    <div className="bg-slate-900/50 border border-white/5 rounded-[3rem] p-10 relative overflow-hidden">
                        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] mb-10">Authorization Matrix</h3>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Roles */}
                            <div>
                                <h4 className="text-white font-bold mb-6">Assigned Roles</h4>
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {user.roles?.map(role => (
                                        <span key={role} className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl text-[10px] font-black uppercase">
                                            {role}
                                        </span>
                                    ))}
                                </div>
                                <button 
                                    onClick={promoteOperative}
                                    disabled={isUpdating}
                                    className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-[11px] font-black rounded-2xl transition-all shadow-xl shadow-cyan-900/20 disabled:opacity-50"
                                >
                                    {isUpdating ? "SYNCHRONIZING..." : "PROMOTE TO MANAGER"}
                                </button>
                            </div>
                            
                            {/* Authorities */}
                            <div>
                                <h4 className="text-white font-bold mb-6">Granular Authorities</h4>
                                <div className="grid grid-cols-1 gap-3">
                                    {user.authorities?.map(auth => (
                                        <div key={auth} className="flex items-center gap-3 p-4 bg-white/[0.02] rounded-2xl border border-white/5 group hover:border-cyan-500/40 transition-all">
                                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]"></div>
                                            <span className="text-slate-400 text-xs font-mono lowercase">{auth}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDossier;