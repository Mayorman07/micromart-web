import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api"; // Utilizing centralized API instance for automated auth management

/**
 * UserDetails Component
 * Provides a granular view of a user's profile, roles, and system authorities.
 * Interfaces with the Spring Boot user service via the centralized security interceptor.
 */
const UserDetails = () => {
    const { email } = useParams();
    const navigate = useNavigate();
    
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUserData();
    }, [email]);

    /**
     * Retrieves user profile data using the email parameter.
     * The Bearer token is automatically attached by the api interceptor.
     */
    const fetchUserData = async () => {
        setLoading(true);
        try {
            /** * Targets Spring Boot @GetMapping(path ="/view/{email}")
             * Base URL and security handshake are handled globally.
             */
            const response = await api.get(`/users/users/view/${email}`);
            setUser(response.data);
            setError(null);
        } catch (err) {
            console.error("Profile Fetch Failed:", err);
            // Handling standardized error status codes from the backend
            if (err.response?.status === 403) {
                setError("ACCESS_DENIED: Insufficient administrative privileges.");
            } else {
                setError("USER_NOT_FOUND: The requested profile does not exist.");
            }
        } finally {
            setLoading(false);
        }
    };

    /**
     * Updates the user role to MANAGER.
     * Hits Spring Boot @PutMapping("/{userId}/roles/manager") using secure API instance.
     */
    const promoteToManager = async () => {
        setIsUpdating(true);
        try {
            // Interceptor handles JWT rotation if session expires during promotion
            await api.put(`/users/users/${email}/roles/manager`, {});
            alert("User successfully promoted to Manager.");
            fetchUserData(); // Refresh local state to reflect new Matrix access
        } catch (error) {
            console.error("Promotion Error:", error);
            alert(error.response?.data?.message || "Promotion failed. Verify administrative permissions.");
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh]">
            <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-mono text-[10px] tracking-[0.3em] uppercase">Loading Profile...</p>
        </div>
    );

    if (error) return (
        <div className="p-10 bg-red-900/10 border border-red-500/20 rounded-[2rem] text-center">
            <h2 className="text-red-500 font-black text-xl mb-2">SERVICE ERROR</h2>
            <p className="text-red-400/70 font-mono text-xs mb-6">{error}</p>
            <button 
                onClick={() => navigate("/admin/dashboard")}
                className="px-6 py-2 bg-red-500 text-white text-xs font-bold rounded-xl hover:bg-red-400 transition-all uppercase"
            >
                Return to Dashboard
            </button>
        </div>
    );

    return (
        <div className="animate-in fade-in duration-500 space-y-8 pb-20">
            
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div className="flex items-center gap-4 text-slate-500 text-sm">
                    <button onClick={() => navigate("/admin/dashboard")} className="hover:text-white transition-colors font-medium text-[11px] uppercase tracking-wider">Dashboard</button>
                    <span className="opacity-30">/</span>
                    <span className="text-cyan-400 font-bold tracking-widest text-xs uppercase">User Profile</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                <div className="md:col-span-4 space-y-6">
                    <div className="bg-[#161b2c] border border-white/5 rounded-[3rem] p-10 text-center relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-cyan-500/10 to-transparent"></div>
                        
                        <div className="relative z-10">
                            <div className="w-32 h-32 bg-slate-900 rounded-full mx-auto mb-6 border-4 border-[#161b2c] shadow-xl flex items-center justify-center text-4xl font-black text-white">
                                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                            </div>
                            
                            <h2 className="text-3xl font-black text-white tracking-tight">
                                {user.firstName} {user.lastName}
                            </h2>
                            <p className="text-cyan-500 font-mono text-[10px] mt-2 tracking-widest uppercase opacity-70">UID: {user.userId?.substring(0,8)}</p>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-8 space-y-8">
                    <div className="bg-slate-900/50 border border-white/5 rounded-[3rem] p-10 shadow-xl">
                        <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-10">Access Control Matrix</h3>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div>
                                <h4 className="text-white text-sm font-bold mb-6">Security Roles</h4>
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {user.roles?.map(role => (
                                        <span key={role} className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl text-[9px] font-black uppercase tracking-wider">
                                            {role}
                                        </span>
                                    ))}
                                </div>
                                <button 
                                    onClick={promoteToManager}
                                    disabled={isUpdating}
                                    className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-[10px] font-black rounded-2xl transition-all shadow-lg hover:shadow-cyan-500/20 disabled:opacity-50 uppercase tracking-widest"
                                >
                                    {isUpdating ? "Processing..." : "Promote to Manager"}
                                </button>
                            </div>
                            
                            <div>
                                <h4 className="text-white text-sm font-bold mb-6">Permissions</h4>
                                <div className="grid grid-cols-1 gap-3">
                                    {user.authorities?.map(auth => (
                                        <div key={auth} className="flex items-center gap-3 p-4 bg-white/[0.02] rounded-2xl border border-white/5 group hover:border-cyan-500/40 transition-all">
                                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]"></div>
                                            <span className="text-slate-400 text-[11px] font-mono">{auth}</span>
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

export default UserDetails;