import { useNavigate, Link, useLocation } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import { Sun, Moon, Search, ShoppingBag, Heart, LogOut, User } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const UserNavbar = ({ cartItemCount = 0 }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { showToast } = useToast();
    const { isDark, toggleTheme } = useTheme();
    const userEmail = localStorage.getItem("userEmail") || "User";

    const handleLogout = () => {
        localStorage.clear();
        showToast("Logged out successfully", "success");
        navigate("/login");
    };

    const activeClass = (path) => 
        location.pathname === path 
            ? "border-b border-gray-800 dark:border-cyan-500 pb-0.5" 
            : "hover:opacity-60 transition-opacity";

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 font-sans
            dark:bg-[#0a0f1d]/90 dark:backdrop-blur-xl dark:border-white/5 
            bg-white/95 backdrop-blur-md border-b border-gray-100 text-gray-800 dark:text-white">
            
            {/* 1. Dynamic Announcement Bar */}
            <div className={`py-2 text-center text-[10px] font-bold tracking-[0.2em] uppercase transition-colors duration-500
                ${isDark ? 'bg-cyan-900/40 text-cyan-400' : 'bg-[#d4d7b8] text-gray-700'}`}>
                {isDark ? "SYSTEM_STATUS: ALL MODULES OPERATIONAL // 15% OFF" : "AUTHENTICITY GUARANTEED: EXPLORE OUR SOURCE CODE & HARDWARE ORIGINS"}
            </div>

            <div className="max-w-7xl mx-auto px-8 py-5">
                <div className="flex justify-between items-center">
                    
                    {/* LEFT: Search (Boutique Style) */}
                    <div className="hidden md:flex w-1/3 items-center border-b border-gray-200 dark:border-white/10 pb-1 max-w-[180px] group">
                        <Search size={14} className="text-gray-400 mr-2 group-focus-within:text-cyan-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="type to search.." 
                            className="bg-transparent outline-none text-[11px] placeholder:italic w-full italic"
                        />
                    </div>

                    {/* CENTER: Logo (The Aesthetic Transformer) */}
                    <Link to="/marketplace" className="flex flex-col items-center group">
                        <span className={`text-3xl tracking-tighter transition-all duration-700
                            ${isDark ? 'font-black uppercase text-white group-hover:text-cyan-400' : 'font-serif italic lowercase text-gray-900'}`}>
                            micromart<span className={isDark ? "text-cyan-500" : "font-sans not-italic font-light ml-0.5"}>4</span>
                        </span>
                    </Link>

                    {/* RIGHT: Utilities & Toggle */}
                    <div className="flex w-1/3 justify-end items-center gap-6">
                        {/* Theme Switcher */}
                        <button 
                            onClick={toggleTheme}
                            className="p-2 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-all active:scale-90"
                        >
                            {isDark ? <Sun size={17} className="text-yellow-400" /> : <Moon size={17} className="text-slate-600" />}
                        </button>

                        <div className="h-6 w-[1px] bg-gray-200 dark:bg-white/10 hidden sm:block"></div>

                        {/* Account Icon (Teeka Style) */}
                        <div className="flex items-center gap-2 cursor-pointer group hidden sm:flex">
                            <User size={18} className="group-hover:text-cyan-500 transition-colors" />
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase tracking-tighter leading-none">{userEmail.split('@')[0]}</p>
                                <p className={`text-[8px] font-bold uppercase tracking-widest mt-0.5 ${isDark ? 'text-cyan-500' : 'text-gray-400'}`}>
                                    {isDark ? "PREMIUM_USER" : "MEMBER"}
                                </p>
                            </div>
                        </div>

                        <Heart size={18} className="cursor-pointer hover:text-red-400 transition-colors hidden xs:block" />

                        {/* Cart with dynamic badge style */}
                        <div className="relative cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate("/cart")}>
                            <ShoppingBag size={20} />
                            {cartItemCount >= 0 && (
                                <span className={`absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold shadow-sm
                                    ${isDark ? 'bg-cyan-500 text-white shadow-cyan-500/40' : 'bg-[#4a5d4e] text-white'}`}>
                                    {cartItemCount}
                                </span>
                            )}
                        </div>

                        <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>

                {/* 3. Global Sub-Navigation */}
                <div className="flex justify-center gap-10 mt-5 pt-3 text-[10px] font-bold uppercase tracking-[0.2em] border-t border-gray-100 dark:border-white/5">
                    <Link to="/marketplace" className={activeClass("/marketplace")}>Marketplace</Link>
                    <Link to="/orders" className={activeClass("/orders")}>My Orders</Link>
                    <Link to="/brands" className={activeClass("/brands")}>Brands +</Link>
                    <Link to="/offers" className={activeClass("/offers")}>Special Offers</Link>
                </div>
            </div>
        </nav>
    );
};

export default UserNavbar;