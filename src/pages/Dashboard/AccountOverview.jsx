import { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useNavigate, Link } from "react-router-dom";
import { Edit2, Wallet, Loader2, ShieldCheck, MapPin, User as UserIcon } from "lucide-react";
import api from "../../services/api";

/**
 * AccountOverview Component
 * Primary administrative dashboard for the user profile.
 * Displays high-level registry data including identity details, 
 * logistics addresses, and security status.
 */
const AccountOverview = () => {
    /** Hooks and Navigation */
    const { isDark } = useTheme();
    const navigate = useNavigate();
    
    /** State Management */
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    /** * Resource Identification
     * Retrieve the unique identifier from local persistence for API synchronization.
     */
    const userEmail = localStorage.getItem("userEmail") || "mayowa.hyde@gmail.com";

    /**
     * Lifecycle: Registry Data Retrieval
     * Synchronizes local state with the backend user entity.
     */
    useEffect(() => {
        let isMounted = true;
        const fetchUserProfile = async () => {
            try {
                const response = await api.get(`users/users/view/${userEmail}`);
                if (isMounted) {
                    setUserData(response.data);
                }
            } catch (err) {
                console.error("Registry Sync Error: Unable to fetch user profile.", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        
        fetchUserProfile();
        return () => { isMounted = false; };
    }, [userEmail]);

    if (loading) return (
        <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
            <Loader2 className={`animate-spin ${isDark ? 'text-cyan-500' : 'text-cyan-600'}`} size={40} />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">Decrypting User Registry...</p>
        </div>
    );

    /** Computed Properties for Display */
    const fullName = `${userData?.firstName || ''} ${userData?.lastName || ''}`;
    
    /** * Address Mapping 
     * Targeted to the singular 'address' object as defined in the backend DTO.
     */
    const displayAddress = userData?.address;

    /** Design System Constants */
    const cardBase = `p-8 rounded-[2.5rem] border transition-all duration-700 ${
        isDark ? 'bg-[#161b2c] border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-sm'
    }`;
    
    const labelStyle = `text-[10px] font-black uppercase tracking-[0.3em] ${isDark ? 'text-slate-500' : 'text-gray-400'}`;

    return (
        <div className="animate-in fade-in duration-700 space-y-8">
            <header>
                <h1 className={`text-4xl font-black tracking-tighter uppercase italic transition-colors duration-500
                    ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Account Overview
                </h1>
                <p className={`${isDark ? 'text-slate-500' : 'text-gray-400'} text-[10px] font-bold uppercase tracking-widest mt-1`}>
                    Administrative Dashboard v2.6
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* IDENTITY DATA SECTION */}
                <section className={cardBase}>
                    <div className="flex justify-between items-start mb-8 border-b border-gray-200 dark:border-white/10 pb-5">
                        <div className="flex items-center gap-3">
                            <UserIcon size={16} className="text-cyan-500" />
                            <h2 className={labelStyle}>Identity Registry</h2>
                        </div>
                        <button 
                            onClick={() => navigate("/account/settings")} 
                            className="text-cyan-500 hover:text-cyan-400 transition-colors"
                            aria-label="Edit Profile"
                        >
                            <Edit2 size={16} />
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <p className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{fullName}</p>
                            <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{userData?.email}</p>
                        </div>
                        <div className="pt-4 flex items-center gap-3 border-t border-white/5">
                            <div className="bg-cyan-500/10 px-3 py-1 rounded-full">
                                <p className="text-[9px] font-black text-cyan-500 uppercase tracking-widest leading-none">
                                    UID: {userData?.userId?.substring(0, 8) || 'SYSTEM-REDACTED'}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* LOGISTICS ADDRESS SECTION */}
                <section className={cardBase}>
                    <div className="flex justify-between items-start mb-8 border-b border-gray-200 dark:border-white/10 pb-5">
                        <div className="flex items-center gap-3">
                            <MapPin size={16} className="text-cyan-500" />
                            <h2 className={labelStyle}>Logistics Destination</h2>
                        </div>
                        <button 
                            onClick={() => navigate("/account/settings")} 
                            className="text-cyan-500 hover:text-cyan-400 transition-colors"
                            aria-label="Modify Address"
                        >
                            <Edit2 size={16} />
                        </button>
                    </div>
                    <div>
                        {displayAddress && displayAddress.street ? (
                            <div className="space-y-1 animate-in slide-in-from-bottom-2">
                                <p className={`text-sm font-bold uppercase tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {displayAddress.street}
                                </p>
                                <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                    {displayAddress.city}, {displayAddress.state} {displayAddress.zipCode}
                                </p>
                                <p className="text-[10px] font-black text-cyan-500/60 uppercase tracking-widest mt-2">
                                    {displayAddress.country}
                                </p>
                            </div>
                        ) : (
                            <div className="py-2 text-left">
                                <p className={`text-xs font-medium italic ${isDark ? 'text-slate-600' : 'text-gray-400'}`}>
                                    No shipping coordinates synchronized to registry.
                                </p>
                                <button 
                                    onClick={() => navigate("/account/settings")} 
                                    className="text-cyan-500 text-[10px] font-black uppercase mt-6 border-b border-cyan-500/20 hover:border-cyan-500 transition-all pb-1"
                                >
                                    Update Address details
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* STORE ASSETS SECTION */}
                <section className={cardBase}>
                    <div className="flex justify-between items-start mb-8 border-b border-gray-200 dark:border-white/10 pb-5">
                        <div className="flex items-center gap-3">
                            <Wallet size={16} className="text-cyan-500" />
                            <h2 className={labelStyle}>Asset Balance</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className={`p-5 rounded-2xl ${isDark ? 'bg-white/5 text-cyan-400' : 'bg-gray-50 text-cyan-600 border border-gray-100'}`}>
                            <Wallet size={28} strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-1 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Available Credit</p>
                            <p className={`text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>$0.00</p>
                        </div>
                    </div>
                </section>

                {/* SECURITY PROTOCOL SECTION */}
                <section className={cardBase}>
                    <div className="flex justify-between items-start mb-8 border-b border-gray-200 dark:border-white/10 pb-5">
                        <div className="flex items-center gap-3">
                            <ShieldCheck size={16} className="text-cyan-500" />
                            <h2 className={labelStyle}>Security Protocol</h2>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <p className={`text-xs font-medium leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                            Account secured with session persistence and multi-layered encryption. 
                            Verified status: <span className="text-cyan-500 font-bold uppercase tracking-widest">Active Sector</span>.
                        </p>
                        <Link 
                            to="/account/settings" 
                            className="inline-block text-cyan-500 hover:text-cyan-400 text-[10px] font-black uppercase tracking-widest border-b border-cyan-500/20 hover:border-cyan-500 transition-all pb-1"
                        >
                            Update Personal Security Protocols
                        </Link>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default AccountOverview;