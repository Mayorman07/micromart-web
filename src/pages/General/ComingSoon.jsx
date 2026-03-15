import { Hammer, ArrowLeft, ShieldAlert, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

const ComingSoon = ({ title = "Module" }) => {
    const navigate = useNavigate();
    const { isDark } = useTheme();

    return (
        <div className={`min-h-[60vh] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700`}>
            
            {/* Professional "Locked" Iconography */}
            <div className="relative mb-8">
                <div className={`absolute inset-0 blur-3xl opacity-20 rounded-full animate-pulse ${isDark ? 'bg-cyan-500' : 'bg-cyan-200'}`} />
                <div className={`relative w-24 h-24 rounded-3xl flex items-center justify-center border-2 border-dashed
                    ${isDark ? 'bg-[#111827] border-white/10 text-cyan-500' : 'bg-white border-gray-200 text-cyan-600'}`}>
                    <ShieldAlert size={40} strokeWidth={1.5} />
                </div>
            </div>

            {/* Status Labels */}
            <div className="space-y-3 mb-10">
                <span className={`text-[10px] font-black uppercase tracking-[0.4em] px-4 py-1.5 rounded-full border
                    ${isDark ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-cyan-50 text-cyan-700 border-cyan-100'}`}>
                    Status: Integration Pending
                </span>
                
                <h1 className="text-4xl font-black uppercase tracking-tighter mt-4">
                    {title}
                </h1>
                
                <p className={`text-xs font-bold uppercase tracking-widest max-w-xs mx-auto leading-relaxed opacity-40`}>
                    This sector is currently undergoing security synchronization. Full access scheduled for next deployment cycle.
                </p>
            </div>

            {/* Interaction Layer */}
            <div className="flex flex-col items-center gap-6">
                <div className="flex items-center gap-3">
                    <Loader2 size={16} className="animate-spin text-cyan-500" />
                    <span className="text-[10px] font-mono font-bold opacity-30">ENCRYPTING MODULE DATA...</span>
                </div>

                <button 
                    onClick={() => navigate(-1)}
                    className={`flex items-center gap-2 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all
                        ${isDark ? 'bg-white text-black hover:bg-cyan-500 hover:text-white' : 'bg-gray-900 text-white hover:bg-cyan-600'}`}
                >
                    <ArrowLeft size={14} />
                    Return to Registry
                </button>
            </div>

            {/* Footer Tag */}
            <div className="mt-20">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-20">
                    Secure Architecture • MicroMart Hub v2.4
                </p>
            </div>
        </div>
    );
};

export default ComingSoon;