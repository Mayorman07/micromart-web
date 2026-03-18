import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LiquidBackgroundDeep from "../../components/LiquidBackgroundDeep";
import Snowfall from "../../components/Snowfall";

/**
 * Dashboard Component
 * Serves as the primary landing hub for the MicroMart ecosystem.
 * Features a Bento Grid layout for high-level navigation and system status.
 */
const Dashboard = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        
        // In production, validate the JWT with the Spring Boot /validate endpoint here
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 600);

        return () => clearTimeout(timer);
    }, []);

    /**
     * Reusable Bento Grid Item
     */
    const BentoItem = ({ children, className = "", span = "", onClick }) => (
        <div 
            onClick={onClick}
            className={`
            ${span} 
            ${className}
            bg-white/90 
            backdrop-blur-xl 
            rounded-[2.5rem] 
            p-10
            shadow-[0_20px_60px_-15px_rgba(0,180,216,0.15)] 
            border border-white/60
            ${onClick ? 'cursor-pointer hover:scale-[1.01] active:scale-[0.99]' : ''}
            transition-all duration-500
            flex flex-col
            relative overflow-hidden
        `}>
            {children}
        </div>
    );

    if (isLoading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-[#0f121d]">
                <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full relative font-sans text-slate-800 p-6 md:p-12 flex items-center justify-center">
            
            <LiquidBackgroundDeep />
            <Snowfall />

            <div className="relative z-10 w-full max-w-6xl animate-in fade-in zoom-in-95 duration-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-[minmax(200px, auto)]">

                    {/* 1. HERO FEATURE CARD */}
                    <BentoItem 
                        span="md:col-span-2 md:row-span-2" 
                        className="!bg-gradient-to-br from-blue-600 to-cyan-500 text-white border-none !shadow-[0_30px_70px_-15px_rgba(0,180,216,0.4)] justify-end"
                    >
                        <div className="absolute top-10 left-10 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/20 inline-flex items-center">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
                            System: Operational
                        </div>

                        <div className="relative z-10">
                            <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter uppercase leading-none">
                                MicroMart <span className="text-cyan-200">2.0</span>
                            </h1>
                            <p className="text-lg text-blue-50 font-medium max-w-md leading-relaxed opacity-90">
                                Enterprise-grade infrastructure powered by Java Spring Boot and React.
                            </p>
                        </div>
                        
                        {/* Background Accents */}
                        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                    </BentoItem>

                    {/* 2. AUTHENTICATION HUB */}
                    <BentoItem onClick={() => navigate('/login')} className="justify-between group">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Portal Access</h3>
                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Login</h2>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wide mt-1">Authorized Access Only</p>
                        </div>
                    </BentoItem>

                    {/* 3. ENGINE STATUS CARD */}
                    <BentoItem className="!bg-slate-900 !border-slate-800 text-white justify-between">
                        <div className="flex justify-between items-start">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Core Engine</h3>
                            <div className="w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_12px_#22d3ee]"></div>
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 uppercase tracking-tight">
                                Quicksilver v1.2
                            </h2>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2">
                                Node Cluster: Optimal
                            </p>
                        </div>
                    </BentoItem>

                    {/* 4. ANNOUNCEMENT BAR */}
                    <BentoItem span="md:col-span-3" className="!bg-white text-slate-900 flex-row items-center justify-between !p-12 overflow-hidden relative">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-black uppercase tracking-tighter mb-1">Stay Informed</h2>
                            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Subscribe for system updates and deployment news.</p>
                        </div>
                        <div className="relative z-10">
                            <button 
                                onClick={() => navigate('/newsletter')}
                                className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                            >
                                Join Newsletter
                            </button>
                        </div>
                    </BentoItem>

                </div>

                <div className="mt-16 text-center text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">
                    © 2026 MicroMart Enterprise • All Systems Go
                </div>
            </div>
        </div>
    );
};

export default Dashboard;