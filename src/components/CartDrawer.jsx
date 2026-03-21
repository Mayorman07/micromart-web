import { useState } from "react";
import { X, Plus, Minus, Trash2, ShoppingBag, Trash } from "lucide-react";
import { useTheme } from "../../src/contexts/ThemeContext"; 
import PaymentModal from "./PaymentModal"; 

const CartDrawer = ({ 
    isOpen, 
    onClose, 
    cartItems = [], 
    onUpdateQuantity, 
    onRemoveItem,
    onClearCart 
}) => {
    const { isDark } = useTheme();
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const subtotal = cartItems.reduce((acc, item) => {
        const price = item.unitPrice || 0;
        const qty = item.quantity || 0;
        return acc + (price * qty);
    }, 0);

    return (
        <>
            {/* --- Backdrop --- */}
            <div 
                className={`fixed inset-0 z-[140] transition-opacity duration-500 bg-black/60 backdrop-blur-sm
                    ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* --- Drawer Container --- */}
            {/*  FIX: Added flex flex-col to the main container */}
            <div className={`fixed top-0 right-0 h-full z-[150] w-full max-w-md shadow-2xl transition-transform duration-500 ease-in-out flex flex-col
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                ${isDark ? 'bg-[#0d1425] text-white border-l border-white/5' : 'bg-white text-gray-900 border-l border-gray-100'}`}>
                
                {/* 1. Header Section (Fixed) */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/5 shrink-0">
                    <div className="flex items-center gap-3">
                        <ShoppingBag size={20} className="text-cyan-500" />
                        <h2 className="text-sm font-black uppercase tracking-widest">
                            Registry Assets
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        {cartItems.length > 0 && (
                            <button onClick={onClearCart} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                <Trash size={18} />
                            </button>
                        )}
                        <button onClick={onClose} className="p-2 hover:rotate-90 transition-transform">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* 2. Items List ( FIX: flex-1 and overflow-y-auto handles the scroll) */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar custom-scrollbar">
                    {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                            <div key={item.skuCode} className="flex gap-4 group animate-in fade-in slide-in-from-right-4">
                                <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/5 border border-white/5 flex-shrink-0">
                                    <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-[11px] font-bold uppercase tracking-tight mb-1 line-clamp-1">{item.productName}</h4>
                                    <p className="text-[10px] font-black text-cyan-500 mb-3">${item.unitPrice?.toFixed(2)}</p>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center border border-white/10 rounded-lg bg-black/20">
                                            <button onClick={() => onUpdateQuantity(item.skuCode, item.quantity - 1)} className="p-1.5 hover:text-cyan-500"><Minus size={12} /></button>
                                            <span className="px-2 text-[10px] font-bold min-w-[24px] text-center">{item.quantity}</span>
                                            <button onClick={() => onUpdateQuantity(item.skuCode, item.quantity + 1)} className="p-1.5 hover:text-cyan-500"><Plus size={12} /></button>
                                        </div>
                                        <button onClick={() => onRemoveItem(item.skuCode)} className="text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center opacity-20">
                            <ShoppingBag size={48} strokeWidth={1} />
                            <p className="mt-4 text-[9px] uppercase font-black tracking-[0.3em]">No Active Deployments</p>
                        </div>
                    )}
                </div>

                {/* 3. Footer Section (Fixed at bottom) */}
                <div className={`p-8 border-t shrink-0 ${isDark ? 'bg-[#0a0f1d] border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Total Value</span>
                        <span className="text-2xl font-black text-cyan-500">${subtotal.toFixed(2)}</span>
                    </div>
                    
                    <button 
                        onClick={() => setIsPaymentModalOpen(true)}
                        disabled={cartItems.length === 0}
                        className="w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] bg-cyan-500 text-black hover:bg-cyan-400 disabled:opacity-20 transition-all shadow-lg shadow-cyan-500/20"
                    >
                        Authorize Purchase
                    </button>
                </div>
            </div>

            <PaymentModal 
                isOpen={isPaymentModalOpen} 
                onClose={() => setIsPaymentModalOpen(false)} 
                cartItems={cartItems}
                totalAmount={subtotal}
            />
        </>
    );
};

export default CartDrawer;