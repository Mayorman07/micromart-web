import { useNavigate, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api"; 
import { useToast } from "../contexts/ToastContext";
import { Sun, Moon, Search, ShoppingBag, LogOut, User, Menu } from "lucide-react"; 
import { useTheme } from "../contexts/ThemeContext";

const UserNavbar = ({ cartItemCount = 0, onOpenCart, searchTerm, setSearchTerm, isAuthenticated }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { showToast } = useToast();
    const { isDark, toggleTheme } = useTheme();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get("/products/categories/all");
                setCategories(response.data);
            } catch (error) {
                console.error("Failed to fetch categories", error);
                setCategories([
                    { id: 1, name: "Eyewear" },
                    { id: 2, name: "RC Hobbies" },
                    { id: 3, name: "Drones" },
                    { id: 4, name: "Anime Collectibles" },
                    { id: 5, name: "Pokemon" }
                ]);
            }
        };
        fetchCategories();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        showToast("Logged out successfully", "success");
        navigate("/login");
    };

    const activeClass = (path) => 
        location.pathname === path 
            ? "text-cyan-500 border-b-2 border-cyan-500 pb-1" 
            : "hover:text-cyan-500 transition-colors";

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500
            dark:bg-[#0a0f1d]/95 dark:backdrop-blur-xl dark:border-white/5 
            bg-white/95 backdrop-blur-md border-b border-gray-100 text-gray-800 dark:text-white">
            
            {/* CLEANED TOP BANNER: Removed Neural Link */}
            <div className={`py-2.5 text-center text-[9px] font-black tracking-[0.3em] uppercase
                ${isDark ? 'bg-[#111827] text-gray-400' : 'bg-gray-50 text-gray-500 border-b border-gray-100'}`}>
                Authenticity Guaranteed • Global Logistics Network
            </div>

            <div className="max-w-7xl mx-auto px-8 py-5">
                <div className="flex justify-between items-center">
                    
                    {/* SEARCH: Refined for better contrast */}
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

                    {/* LOGO: Fortune 500 clean aesthetic */}
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

                {/* NAVIGATION: Streamlined and focused */}
                <div className="flex justify-center gap-12 mt-6 pt-5 text-[10px] font-black uppercase tracking-[0.25em] border-t border-gray-100 dark:border-white/5">
                    <Link to="/" className={activeClass("/")}>Marketplace</Link>
                    
                    <div className="group relative">
                        <button className="hover:text-cyan-500 transition-colors flex items-center gap-1">
                            Collections <Menu size={10} className="opacity-40" />
                        </button>
                        <div className="absolute top-full -left-10 hidden group-hover:block pt-4 w-60 animate-in fade-in slide-in-from-top-2">
                            <div className={`overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-2xl
                                ${isDark ? 'bg-[#0a0f1d]/98 border-white/10' : 'bg-white/98 border-gray-100'}`}>
                                <div className="py-2">
                                    {categories.map((cat) => (
                                        <button 
                                            key={cat.id} 
                                            onClick={() => navigate(`/?category=${cat.id}`)}
                                            className={`w-full text-left px-6 py-3.5 text-[9px] font-black uppercase tracking-[0.15em] transition-all
                                                ${isDark ? 'text-gray-400 hover:text-cyan-400 hover:bg-white/5' : 'text-gray-500 hover:text-cyan-600 hover:bg-cyan-50'}`}>
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {isAuthenticated && <Link to="/orders" className={activeClass("/orders")}>My Orders</Link>}
                    
                    {/* Removed Special Offers and other placeholder links to keep focus on functional paths */}
                </div>
            </div>
        </nav>
    );
};

export default UserNavbar;