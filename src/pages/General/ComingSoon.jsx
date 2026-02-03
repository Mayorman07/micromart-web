// src/pages/General/ComingSoon.jsx
import { useNavigate } from "react-router-dom";
import LiquidBackgroundDeep from "../../components/LiquidBackgroundDeep";
import Snowfall from "../../components/Snowfall";

const ComingSoon = ({ title = "Coming Soon", message = "We are working hard to bring this feature to life." }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans">
            <LiquidBackgroundDeep />
            <Snowfall />

            <div className="relative z-10 w-full max-w-md p-10 mx-4 text-center 
                bg-white/95 
                backdrop-blur-xl 
                rounded-3xl 
                shadow-[0_20px_60px_-15px_rgba(0,180,216,0.5)] 
                border border-white/60"
            >
                <div className="w-20 h-20 bg-cyan-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-cyan-100">
                    <span className="text-4xl">🚀</span>
                </div>

                <h1 className="text-3xl font-extrabold text-slate-900 mb-3">{title}</h1>
                <p className="text-slate-500 mb-8 font-medium leading-relaxed">
                    {message}
                </p>

                <button 
                    onClick={() => navigate(-1)} 
                    className="px-8 py-3 rounded-xl font-bold text-cyan-600 bg-cyan-50 hover:bg-cyan-100 transition-colors"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default ComingSoon;