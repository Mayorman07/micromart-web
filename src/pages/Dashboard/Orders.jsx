import { useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const Orders = () => {
    const { isDark } = useTheme();
    const navigate = useNavigate();

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
            {/* 1. Icon Container - Now using Aqua accents in Light Mode */}
            <div className={`mb-8 p-8 rounded-full transition-all duration-500 
                ${isDark 
                    ? 'bg-white/5 text-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.1)]' 
                    : 'bg-cyan-50 text-cyan-500 border border-cyan-100 shadow-sm'}`}>
                <ShoppingBag size={64} strokeWidth={1.5} />
            </div>

            {/* 2. Main Heading - High Contrast */}
            <h2 className={`text-4xl font-black uppercase tracking-tighter mb-4 transition-colors duration-500
                ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Order Registry
            </h2>

            {/* 3. Subtext - Professional Hardware Tone */}
            <p className={`max-w-md text-sm font-medium tracking-wide mb-10 transition-colors duration-500
                ${isDark ? 'text-slate-400' : 'text-gray-500 font-normal italic'}`}>
                Hardware acquisition logs are currently empty. Initialize a transaction in the marketplace to register your first asset.
            </p>

            {/* 4. Action Button - Unified Aqua Style */}
            <button 
                onClick={() => navigate("/marketplace")}
                className={`px-12 py-4 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all active:scale-95
                ${isDark 
                    ? 'bg-white text-black hover:bg-cyan-500 shadow-lg shadow-cyan-500/20' 
                    : 'bg-cyan-500 text-white hover:bg-cyan-600 shadow-xl shadow-cyan-500/20'}`}
            >
                Initialize Shopping
            </button>
        </div>
    );
};

export default Orders;