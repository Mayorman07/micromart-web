import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const PaymentSuccess = () => {
    const { isDark } = useTheme();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const orderId = searchParams.get("orderId");

    useEffect(() => {
        // TODO: In the future, you can trigger your 'clearCart' context function here
        // so the registry is empty when they go back to the shop!
    }, []);

    return (
        <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-500 
            ${isDark ? 'bg-[#0a0f1d] text-white' : 'bg-gray-50 text-gray-900'}`}>
            
            <div className={`max-w-md w-full p-8 rounded-2xl shadow-2xl text-center border
                ${isDark ? 'bg-[#0d1425] border-white/5' : 'bg-white border-gray-100'}`}>
                
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-20 rounded-full animate-pulse" />
                        <CheckCircle2 size={80} className="text-emerald-500 relative z-10" />
                    </div>
                </div>

                <h1 className={`text-3xl font-black uppercase tracking-tighter mb-2 ${!isDark && 'font-serif italic capitalize'}`}>
                    Payment Successful
                </h1>
                
                <p className="opacity-60 text-sm mb-6">
                    Thank you for your purchase! Your transaction has been securely processed.
                </p>

                {orderId && (
                    <div className={`p-4 rounded-xl mb-8 border inline-block
                        ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1">Order Reference</p>
                        <p className="font-mono text-lg font-bold text-cyan-500">{orderId}</p>
                    </div>
                )}

                <div className="space-y-3">
                    <button 
                        onClick={() => navigate('/orders')} // Adjust route to your orders page
                        className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2
                            ${isDark ? 'bg-white text-black hover:bg-cyan-500 hover:text-white' : 'bg-cyan-500 text-white hover:bg-cyan-600'}`}
                    >
                        <ShoppingBag size={16} />
                        View My Orders
                    </button>
                    
                    <button 
                        onClick={() => navigate('/')} // Adjust route to your marketplace
                        className="w-full py-4 rounded-xl text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
                    >
                        Continue Shopping
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;