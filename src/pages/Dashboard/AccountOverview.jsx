import { useTheme } from "../../contexts/ThemeContext";
import { Edit2, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

const AccountOverview = () => {
    const { isDark } = useTheme();
    const userEmail = localStorage.getItem("userEmail") || "user@micromart.com";
    const userName = userEmail.split('@')[0]; // Quick fallback for name

    return (
        <div className="animate-in fade-in duration-500">
            <h1 className={`text-3xl tracking-tighter uppercase mb-8 transition-colors duration-500
                ${isDark ? 'font-black text-white' : 'font-serif italic text-gray-900 lowercase'}`}>
                Account Overview
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* ACCOUNT DETAILS CARD */}
                <div className={`p-8 rounded-[2rem] transition-colors duration-500 border
                    ${isDark ? 'bg-[#161b2c] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
                    <div className="flex justify-between items-start mb-6 border-b border-gray-200 dark:border-white/10 pb-4">
                        <h2 className={`text-[11px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                            Account Details
                        </h2>
                        <button className="text-cyan-500 hover:text-cyan-600 transition-colors">
                            <Edit2 size={16} />
                        </button>
                    </div>
                    <div>
                        <p className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{userName}</p>
                        <p className={isDark ? 'text-slate-400' : 'text-gray-500'}>{userEmail}</p>
                    </div>
                </div>

                {/* ADDRESS BOOK CARD */}
                <div className={`p-8 rounded-[2rem] transition-colors duration-500 border
                    ${isDark ? 'bg-[#161b2c] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
                    <div className="flex justify-between items-start mb-6 border-b border-gray-200 dark:border-white/10 pb-4">
                        <h2 className={`text-[11px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                            Address Book
                        </h2>
                        <button className="text-cyan-500 hover:text-cyan-600 transition-colors">
                            <Edit2 size={16} />
                        </button>
                    </div>
                    <div>
                        <p className={`text-sm font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Your default shipping address:</p>
                        <p className={`text-sm leading-relaxed uppercase ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                            {userName}<br />
                            13 BOROKINI STREET IKORODU LAGOS STATE<br />
                            Ikorodu-Garage, Lagos<br />
                            +234 8083970700 / +234 7040544232
                        </p>
                    </div>
                </div>

                {/* STORE CREDIT CARD */}
                <div className={`p-8 rounded-[2rem] transition-colors duration-500 border
                    ${isDark ? 'bg-[#161b2c] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
                    <div className="flex justify-between items-start mb-6 border-b border-gray-200 dark:border-white/10 pb-4">
                        <h2 className={`text-[11px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                            MicroMart Store Credit
                        </h2>
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

                {/* NEWSLETTER PREFERENCES CARD */}
                <div className={`p-8 rounded-[2rem] transition-colors duration-500 border
                    ${isDark ? 'bg-[#161b2c] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
                    <div className="flex justify-between items-start mb-6 border-b border-gray-200 dark:border-white/10 pb-4">
                        <h2 className={`text-[11px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                            Newsletter Preferences
                        </h2>
                    </div>
                    <div>
                        <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                            Manage your email communications to stay updated with the latest hardware drops and system upgrades.
                        </p>
                        <Link to="/account/newsletter" className="text-cyan-500 hover:text-cyan-600 text-sm font-bold transition-colors">
                            Edit Newsletter Preferences
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AccountOverview;