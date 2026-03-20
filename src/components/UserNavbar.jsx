import { useNavigate, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api"; 
import { useToast } from "../contexts/ToastContext";
import { Sun, Moon, Search, ShoppingBag, LogOut, User, ChevronDown, LayoutGrid } from "lucide-react"; 
import { useTheme } from "../contexts/ThemeContext";

/**
 * UserNavbar Component
 * Central command interface for the MicroMart Hub.
 * Features an administrative Mega-Menu for rapid sector deployment.
 */
const UserNavbar = ({ cartItemCount = 0, onOpenCart, searchTerm, setSearchTerm, isAuthenticated }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { showToast } = useToast();
    const { isDark, toggleTheme } = useTheme();
    const [categories, setCategories] = useState([]);
    const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

    // Hardcoded descriptions to match your provided category registry
    const categoryDescriptions = {
        "Eyewear": "Smart glasses, VR headsets, and vision tech.",
        "RC Hobbies": "Remote controlled cars, boats, and planes.",
        "Drones": "Aerial photography and racing quadcopters.",
        "Anime Collectibles": "Figures, statues, and limited edition gear.",
        "Pokemon": "Catch, train, and battle collectible creatures.",
        "Pens": "Industrial-grade precision writing instruments."
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get("/products/categories/all");
                setCategories(response.data);
            } catch (error) {
                console.error("Registry Sync Error: Using local fallback categories.");
                setCategories([
                    { id: 1, name: "Eyewear" },
                    { id: 2, name: "RC Hobbies" },
                    { id: 3, name: "Drones" },
                    { id: 4, name: "Anime Collectibles" },
                    { id: 5, name: "Pokemon" },
                    { id: 6, name: "Pens" }
                ]);
            }
        };
        fetchCategories();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        showToast("Session Terminated: Logged out successfully", "success");
        navigate("/login");
    };

    const activeClass = (path) => 
        location.pathname === path 
            ? "text-cyan-500 border-b-2 border-cyan-500 pb-1" 
            : "hover:text-cyan-500 transition-colors";

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500
            dark:bg-[#0a0f1d]/95 dark:backdrop-blur-xl dark:border-white/5 
            bg-white/95 backdrop-blur-md border-b border-gray-100 text-gray-800 dark:text-white"
            onMouseLeave={() => setIsMegaMenuOpen(false)}>
            
            <div className={`py-2.5 text-center text-[9px] font-black tracking-[0.3em] uppercase
                ${isDark ? 'bg-[#111827] text-gray-400' : 'bg-gray-50 text-gray-500 border-b border-gray-100'}`}>
                Authenticity Guaranteed • Global Logistics Network
            </div>

            <div className="max-w-7xl mx-auto px-8 py-5">
                <div className="flex justify-between items-center">
                    
                    {/* SEARCH INTERFACE */}
                    <div className="hidden md:flex w-1/3 items-center border-b border-gray-200 dark:border-white/10 pb-1 max-w-[200px] group">
                        <Search size={14} className="text-gray-400 mr-2 group-focus-within:text-cyan-500 transition-colors" />
                        <input 
                            type="text" 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            placeholder="SEARCH ASSETS.." 
                            className="bg-transparent outline-none text-[10px] font-bold uppercase tracking-widest w-full placeholder:text-gray-500" 
                        />
                    </div>

                    {/* LOGO */}
                    <Link to="/" className="flex flex-col items-center">
                        <span className={`text-3xl tracking-tighter font-black uppercase transition-all
                            ${isDark ? 'text-white' : 'text-[#111827]'}`}>
                            micromart<span className="text-cyan-500">4</span>
                        </span>
                    </Link>

                    {/* ACTIONS */}
                    <div className="flex w-1/3 justify-end items-center gap-6">
                        <button onClick={toggleTheme} className="opacity-60 hover:opacity-100 transition-opacity">
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                        
                        {isAuthenticated ? (
                            <div className="flex gap-5 items-center">
                                <Link to="/account" className="opacity-60 hover:opacity-100 hover:text-cyan-500"><User size={20} /></Link>
                                <button onClick={handleLogout} className="opacity-60 hover:opacity-100 hover:text-red-500 transition-colors"><LogOut size={20} /></button>
                            </div>
                        ) : (
                            <Link to="/login" className="text-[10px] font-black uppercase tracking-widest border-b-2 border-cyan-500 pb-0.5">Sign In</Link>
                        )}

                        <div className="relative cursor-pointer opacity-80 hover:opacity-100 transition-all" onClick={onOpenCart}>
                            <ShoppingBag size={22} strokeWidth={1.5} />
                            {cartItemCount > 0 && (
                                <span className="absolute -right-2 -top-2 bg-cyan-500 text-white rounded-full h-4 w-4 text-[9px] flex items-center justify-center font-black animate-in zoom-in">
                                    {cartItemCount}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* PRIMARY NAVIGATION WITH MEGA MENU TRIGGER */}
                <div className="flex justify-center gap-12 mt-6 pt-5 text-[10px] font-black uppercase tracking-[0.25em] border-t border-gray-100 dark:border-white/5">
                    <Link to="/" className={activeClass("/")}>Marketplace</Link>
                    
                    <button 
                        onMouseEnter={() => setIsMegaMenuOpen(true)}
                        className={`transition-colors flex items-center gap-2 ${isMegaMenuOpen ? 'text-cyan-500' : 'hover:text-cyan-500'}`}
                    >
                        Collections <ChevronDown size={10} className={`transition-transform duration-300 ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isAuthenticated && <Link to="/orders" className={activeClass("/orders")}>My Orders</Link>}
                </div>
            </div>

            {/* ADMINISTRATIVE MEGA MENU PANEL */}
            <div className={`absolute top-full left-0 w-full transition-all duration-500 overflow-hidden ${
                isMegaMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
            }`}>
                <div className={`mx-auto max-w-7xl mt-2 rounded-b-[3rem] p-12 border-x border-b shadow-3xl backdrop-blur-3xl
                    ${isDark ? 'bg-[#0a0f1d]/98 border-white/5' : 'bg-white/98 border-gray-100'}`}>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-16 gap-y-12">
                        {categories.map((cat) => (
                            <button 
                                key={cat.id}
                                onClick={() => {
                                    navigate(`/?category=${cat.id}`);
                                    setIsMegaMenuOpen(false);
                                }}
                                className="group flex items-start gap-4 text-left transition-all"
                            >
                                <div className={`p-3 rounded-2xl transition-all ${isDark ? 'bg-white/5 group-hover:bg-cyan-500/10 group-hover:text-cyan-400' : 'bg-gray-50 group-hover:bg-cyan-50 group-hover:text-cyan-600'}`}>
                                    <LayoutGrid size={18} strokeWidth={2.5} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className={`text-[11px] font-black uppercase tracking-[0.15em] transition-colors ${isDark ? 'text-white' : 'text-gray-900'} group-hover:text-cyan-500`}>
                                        {cat.name}
                                    </h4>
                                    <p className="text-slate-500 text-[10px] leading-relaxed font-medium lowercase first-letter:uppercase">
                                        {categoryDescriptions[cat.name] || "Registry sector for specialized hardware and collectibles."}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="mt-12 pt-8 border-t border-current/5 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-20 italic">Sector Registry Alpha v2.6</span>
                        </div>
                        <button 
                            onClick={() => { navigate('/'); setIsMegaMenuOpen(false); }}
                            className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500 hover:text-cyan-400 underline underline-offset-8 decoration-cyan-500/30"
                        >
                            View Full Marketplace Registry
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default UserNavbar;