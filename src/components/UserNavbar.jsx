import { useNavigate, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api"; 
import { useToast } from "../contexts/ToastContext";
import { Sun, Moon, Search, ShoppingBag, Heart, LogOut, User, X, LogIn, UserPlus } from "lucide-react"; 
import { useTheme } from "../contexts/ThemeContext";

const UserNavbar = ({ cartItemCount = 0, onOpenCart, searchTerm, setSearchTerm, isAuthenticated }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { showToast } = useToast();
    const { isDark, toggleTheme } = useTheme();
    const userEmail = localStorage.getItem("userEmail") || ""; 
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
            ? "border-b-2 border-gray-800 dark:border-cyan-500 pb-1" 
            : "hover:opacity-60 transition-opacity";

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500
            dark:bg-[#0a0f1d]/95 dark:backdrop-blur-xl dark:border-white/5 
            bg-white/95 backdrop-blur-md border-b border-gray-100 text-gray-800 dark:text-white">
            
            <div className={`py-2 text-center text-[10px] font-bold tracking-[0.2em] uppercase
                ${isDark ? 'bg-cyan-900/40 text-cyan-400' : 'bg-cyan-50 text-cyan-700 border-b border-cyan-100'}`}>
                {isDark ? "// NEURAL LINK ESTABLISHED" : "AUTHENTICITY GUARANTEED"}
            </div>

            <div className="max-w-7xl mx-auto px-8 py-6">
                <div className="flex justify-between items-center">
                    <div className="hidden md:flex w-1/3 items-center border-b border-gray-200 dark:border-white/10 pb-1 max-w-[180px] group relative">
                        <Search size={14} className="text-gray-400 mr-2 group-focus-within:text-cyan-500 transition-colors" />
                        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="SEARCH ASSETS.." className="bg-transparent outline-none text-[11px] w-full" />
                    </div>

                    <Link to="/" className="flex flex-col items-center group">
                        <span className={`text-4xl tracking-tighter transition-all duration-700
                            ${isDark ? 'font-black uppercase text-white group-hover:text-cyan-400' : 'font-serif italic text-gray-900'}`}>
                            micromart<span className="text-cyan-500">4</span>
                        </span>
                    </Link>

                    <div className="flex w-1/3 justify-end items-center gap-6">
                        <button onClick={toggleTheme}>{isDark ? <Sun size={18} /> : <Moon size={18} />}</button>
                        {isAuthenticated ? (
                            <div className="flex gap-4 items-center">
                                <Link to="/account"><User size={20} /></Link>
                                <button onClick={handleLogout}><LogOut size={20} /></button>
                            </div>
                        ) : (
                            <Link to="/login" className="text-xs font-bold uppercase tracking-widest">Sign In</Link>
                        )}
                        <div className="relative cursor-pointer" onClick={onOpenCart}>
                            <ShoppingBag size={22} />
                            {cartItemCount > 0 && <span className="absolute -right-2 -top-2 bg-cyan-500 text-white rounded-full h-4 w-4 text-[9px] flex items-center justify-center font-bold">{cartItemCount}</span>}
                        </div>
                    </div>
                </div>

                <div className="flex justify-center gap-12 mt-6 pt-4 text-[11px] font-black uppercase tracking-[0.2em] border-t border-gray-100 dark:border-white/5">
                    <Link to="/" className={activeClass("/")}>Marketplace</Link>
                    
                    <div className="group relative">
                        <button className="hover:text-cyan-500 transition-colors flex items-center gap-1">
                            Collections <span className="text-[10px] opacity-40">+</span>
                        </button>
                        <div className="absolute top-full -left-10 hidden group-hover:block pt-4 w-64 animate-in fade-in slide-in-from-top-1">
                            <div className={`overflow-hidden rounded-[2rem] border shadow-2xl backdrop-blur-xl
                                ${isDark ? 'bg-[#0a0f1d]/95 border-white/10' : 'bg-white/95 border-gray-100'}`}>
                                <div className="py-4">
                                    {categories.map((cat) => (
                                        <button key={cat.id} onClick={() => navigate(`/?category=${cat.id}`)}
                                            className={`w-full text-left px-8 py-4 text-xs font-black uppercase tracking-widest transition-all
                                                ${isDark ? 'text-gray-400 hover:text-cyan-400 hover:bg-white/5' : 'text-gray-500 hover:text-cyan-600 hover:bg-cyan-50'}`}>
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {isAuthenticated && <Link to="/orders" className={activeClass("/orders")}>My Orders</Link>}
                    <Link to="/offers" className={activeClass("/offers")}>Special Offers</Link>
                </div>
            </div>
        </nav>
    );
};

export default UserNavbar;