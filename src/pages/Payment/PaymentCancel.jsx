import { useNavigate } from "react-router-dom";
import { XCircle, ArrowLeft, RefreshCcw } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const PaymentCancel = () => {
    const { isDark } = useTheme();
    const navigate = useNavigate();

    return (
        <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-500 
            ${isDark ? 'bg-[#0a0f1d] text-white' : 'bg-gray-50 text-gray-900'}`}>
            
            <div className={`max-w-md w-full p-8 rounded-2xl shadow-2xl text-center border
                ${isDark ? 'bg-[#0d1425] border-white/5' : 'bg-white border-gray-100'}`}>
                
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-red-500 blur-xl opacity-20 rounded-full" />
                        <XCircle size={80} className="text-red-500 relative z-10" />
                    </div>
                </div>

                <h1 className={`text-3xl font-black uppercase tracking-tighter mb-2 ${!isDark && 'font-serif italic capitalize'}`}>
                    Payment Cancelled
                </h1>
                
                <p className="opacity-60 text-sm mb-8">
                    Your checkout process was safely interrupted. No charges have been made to your account.
                </p>

                <div className="space-y-3">
                    <button 
                        onClick={() => navigate('/')} // User goes back to marketplace to open cart again
                        className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2
                            ${isDark ? 'bg-white text-black hover:bg-cyan-500 hover:text-white' : 'bg-cyan-500 text-white hover:bg-cyan-600'}`}
                    >
                        <RefreshCcw size={16} />
                        Return to Checkout
                    </button>
                    
                    <button 
                        onClick={() => navigate('/')} 
                        className="w-full py-4 rounded-xl text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={16} />
                        Back to Marketplace
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentCancel;