import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LiquidBackgroundDeep from "../../components/LiquidBackgroundDeep";
import Snowfall from "../../components/Snowfall";

const Dashboard = () => {
    const navigate = useNavigate();
    const [userToken, setUserToken] = useState("DEV-MODE-TOKEN");
    
    // 🛑 DEV MODE: Set loading to false immediately so we see the page
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        
        if (token) {
            setUserToken(token);
        }
        
        // ⚠️ AUTH CHECK DISABLED FOR DESIGNING
        // if (!token) {
        //     navigate('/login');
        // } else {
        //     setUserToken(token);
        //     setIsLoading(false);
        // }

    }, [navigate]);

    // 🍱 Reusable Bento Card Component
    const BentoItem = ({ children, className = "", span = "", onClick }) => (
        <div 
            onClick={onClick}
            className={`
            ${span} 
            ${className}
            bg-white/90 
            backdrop-blur-xl 
            rounded-[2rem] 
            p-8
            shadow-[0_20px_60px_-15px_rgba(0,180,216,0.3)] 
            border border-white/60
            ${onClick ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : ''}
            transition-all duration-300
            flex flex-col
            relative overflow-hidden
        `}>
            {children}
        </div>
    );

    if (isLoading) {
        return <div className="min-h-screen w-full flex items-center justify-center bg-blue-900 text-white">Loading...</div>;
    }

    return (
        <div className="min-h-screen w-full relative font-sans text-slate-800 p-6 md:p-10 flex items-center justify-center">
            
            {/* Background Layers */}
            <LiquidBackgroundDeep />
            <Snowfall />

            <div className="relative z-10 w-full max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(180px, auto)]">

                    {/* 1. MAIN FEATURE CARD */}
                    <BentoItem 
                        span="md:col-span-2 md:row-span-2" 
                        className="!bg-gradient-to-br from-cyan-500 to-blue-600 text-white relative overflow-hidden border-none !shadow-[0_20px_60px_-15px_rgba(0,180,216,0.6)] justify-end"
                    >
                        {/* Status Badge */}
                        <div className="absolute top-8 left-8 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest border border-white/30 inline-flex items-center">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                            Status: Engineering
                        </div>

                        <div className="relative z-10">
                            <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight drop-shadow-lg">
                                MicroMart <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-white">v2.0</span>
                            </h1>
                            <p className="text-lg text-blue-50 font-medium max-w-xl leading-relaxed drop-shadow-sm">
                                We're currently refactoring our core infrastructure to deliver 10x better experience.
                            </p>
                        </div>
                        
                        {/* Abstract shapes */}
                        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-blob"></div>
                        <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
                    </BentoItem>


                    {/* 2. Login Link Card */}
                    <BentoItem onClick={() => navigate('/login')} className="justify-between group hover:bg-white">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-extrabold text-slate-900">Login</h3>
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-slate-900 group-hover:translate-x-1 transition-transform">
                                    <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-slate-500 font-medium mt-12">Access your existing account.</p>
                    </BentoItem>


                    {/* 3. Dynamic Module Status Card */}
                    <BentoItem className="!bg-slate-900 !border-slate-800 text-white justify-between">
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-bold">Quicksilver</h3>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-cyan-400 animate-spin-slow">
                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                            Snowfall on Liquid Glass
                            </h2>
                            <p className="text-slate-400 text-sm font-medium mt-2">
                                v1.2 • Running optimally
                            </p>
                        </div>
                    </BentoItem>


                    {/* 4. Newsletter Subscription Card */}
                    <BentoItem span="md:col-span-3" className="!bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex-row items-center justify-between !p-10 overflow-hidden relative">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-extrabold mb-2 drop-shadow-md">Get Launch Updates</h2>
                            <p className="text-blue-100 text-lg font-medium drop-shadow-sm">Be the first to know when we go live.</p>
                        </div>
                        <div className="relative z-10">
                            {/* 👇 ADDED NAVIGATE TO NEWSLETTER HERE */}
                            <button 
                                onClick={() => navigate('/newsletter')}
                                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-extrabold text-lg hover:bg-blue-50 hover:scale-105 transition-all shadow-lg"
                            >
                                Subscribe Now
                            </button>
                        </div>
                        
                        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    </BentoItem>

                </div>

                <div className="mt-12 text-center text-sm text-slate-500 font-medium">
                    © 2026 MicroMart Inc. Built with Violet.
                </div>
            </div>
        </div>
    );
};

export default Dashboard;