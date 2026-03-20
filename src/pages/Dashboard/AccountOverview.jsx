import { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useNavigate, Link } from "react-router-dom";
import { Edit2, Wallet, Loader2 } from "lucide-react";
import api from "../../services/api";

const AccountOverview = () => {
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const userEmail = localStorage.getItem("userEmail") || "mayowa.hyde@gmail.com";

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await api.get(`users/users/view/${userEmail}`);
                setUserData(response.data);
            } catch (err) {
                console.error("Failed to fetch user profile:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, [userEmail]);

    if (loading) return (
        <div className="flex h-64 items-center justify-center">
            <Loader2 className={`animate-spin ${isDark ? 'text-cyan-500' : 'text-cyan-600'}`} size={32} />
        </div>
    );

    const fullName = `${userData?.firstName || ''} ${userData?.lastName || ''}`;
    const displayAddress = userData?.address;

    const cardBase = `p-8 rounded-[2rem] border transition-all duration-500 ${
        isDark ? 'bg-[#161b2c] border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-sm'
    }`;
    
    const labelStyle = `text-[11px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-slate-400' : 'text-gray-500'}`;

    return (
        <div className="animate-in fade-in duration-500">
            <h1 className={`text-3xl tracking-tighter uppercase mb-8 transition-colors duration-500
                ${isDark ? 'font-black text-white' : 'font-serif italic text-gray-900 lowercase'}`}>
                Account Overview
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* ACCOUNT DETAILS */}
                <div className={cardBase}>
                    <div className="flex justify-between items-start mb-6 border-b border-gray-200 dark:border-white/10 pb-4">
                        <h2 className={labelStyle}>Account Details</h2>
                        <button onClick={() => navigate("/account/settings")} className="text-cyan-500 hover:scale-110 transition-transform">
                            <Edit2 size={16} />
                        </button>
                    </div>
                    <div>
                        <p className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{fullName}</p>
                        <p className={isDark ? 'text-slate-400' : 'text-gray-500'}>{userData?.email}</p>
                        <p className={`text-[10px] mt-3 font-mono ${isDark ? 'text-cyan-500/40' : 'text-cyan-700/40'}`}>UID: {userData?.userId?.substring(0,8)}</p>
                    </div>
                </div>

                {/* ADDRESS BOOK */}
                <div className={cardBase}>
                    <div className="flex justify-between items-start mb-6 border-b border-gray-200 dark:border-white/10 pb-4">
                        <h2 className={labelStyle}>Address Book</h2>
                        <button onClick={() => navigate("/account/settings")} className="text-cyan-500 hover:scale-110 transition-transform">
                            <Edit2 size={16} />
                        </button>
                    </div>
                    <div>
                        {displayAddress ? (
                            <p className={`text-sm leading-relaxed uppercase font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                <span className="block font-bold text-white mb-2">Primary Destination:</span>
                                {displayAddress.street}<br />
                                {displayAddress.city}, {displayAddress.state} {displayAddress.zipCode}<br />
                                {displayAddress.country}
                            </p>
                        ) : (
                            <div className="py-2 text-center">
                                <p className={`text-sm italic ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>No shipping address registered.</p>
                                <button onClick={() => navigate("/account/settings")} className="text-cyan-500 text-[10px] font-black uppercase mt-4 underline underline-offset-4">
                                    + Setup Registry
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* STORE CREDIT */}
                <div className={cardBase}>
                    <div className="flex justify-between items-start mb-6 border-b border-gray-200 dark:border-white/10 pb-4">
                        <h2 className={labelStyle}>Store Credit</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-xl ${isDark ? 'bg-cyan-500/10 text-cyan-400' : 'bg-cyan-50 text-cyan-600'}`}>
                            <Wallet size={24} />
                        </div>
                        <div>
                            <p className={isDark ? 'text-slate-400' : 'text-gray-500'}>Current Balance</p>
                            <p className={`text-2xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>$0.00</p>
                        </div>
                    </div>
                </div>

                {/* PREFERENCES */}
                <div className={cardBase}>
                    <div className="flex justify-between items-start mb-6 border-b border-gray-200 dark:border-white/10 pb-4">
                        <h2 className={labelStyle}>Security Settings</h2>
                    </div>
                    <div>
                        <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                            Account secured with JWT session persistence. Verified status: ACTIVE.
                        </p>
                        <Link to="/account/settings" className="text-cyan-500 hover:text-cyan-600 text-[10px] font-black uppercase tracking-widest border-b border-cyan-500/20 pb-1">
                            Modify Registry Settings
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AccountOverview;