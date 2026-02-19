import { useNavigate } from "react-router-dom";
import LiquidBackgroundDeep from "../../components/LiquidBackgroundDeep";
import Snowfall from "../../components/Snowfall";

/**
 * ComingSoon Component
 * A graceful fallback for routes or features still under development.
 * Accepts dynamic props to customize the placeholder message.
 */
const ComingSoon = ({ 
    title = "Feature Pending", 
    message = "Our engineering team is currently refactoring this module to meet MicroMart 2.0 standards." 
}) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans">
            <LiquidBackgroundDeep />
            <Snowfall />

            {/* Placeholder Card */}
            <div className="relative z-10 w-full max-w-md p-10 mx-4 text-center 
                bg-white/95 
                backdrop-blur-xl 
                rounded-[2.5rem] 
                shadow-[0_20px_60px_-15px_rgba(0,180,216,0.2)] 
                border border-white/60"
            >
                {/* Status Icon */}
                <div className="w-20 h-20 bg-cyan-50/50 rounded-full flex items-center justify-center mx-auto mb-8 border border-cyan-100">
                    <span className="text-3xl animate-pulse">🚀</span>
                </div>

                <h1 className="text-3xl font-black text-slate-900 mb-3 uppercase tracking-tighter">
                    {title}
                </h1>
                <p className="text-slate-500 mb-10 text-xs font-bold uppercase tracking-[0.15em] leading-relaxed">
                    {message}
                </p>

                <button 
                    onClick={() => navigate(-1)} 
                    className="w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-cyan-600 bg-cyan-50/50 border border-cyan-100 hover:bg-cyan-100 hover:text-cyan-700 transition-all active:scale-95"
                >
                    Return to Previous Page
                </button>
            </div>
        </div>
    );
};

export default ComingSoon;