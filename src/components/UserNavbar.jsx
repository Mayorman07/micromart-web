import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";

const UserNavbar = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const userEmail = localStorage.getItem("userEmail") || "User";

    const handleLogout = () => {
        localStorage.clear();
        showToast("Logged out successfully", "success");
        navigate("/login");
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0f1d]/80 backdrop-blur-xl border-b border-white/5 px-8 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/marketplace" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                        <span className="text-white font-black text-xl">M</span>
                    </div>
                    <span className="text-white font-black tracking-tighter text-xl uppercase group-hover:text-cyan-400 transition-colors">MicroMart</span>
                </Link>

                <div className="flex items-center gap-8">
                    <Link to="/marketplace" className="text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-widest transition-colors">Marketplace</Link>
                    <Link to="/orders" className="text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-widest transition-colors">My Orders</Link>
                    
                    <div className="h-4 w-[1px] bg-white/10"></div>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-black text-white uppercase tracking-tighter leading-none">{userEmail.split('@')[0]}</p>
                            <p className="text-[8px] font-bold text-cyan-500 uppercase tracking-widest">Premium Member</p>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-500 p-2.5 rounded-xl border border-white/5 hover:border-red-500/20 transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default UserNavbar;