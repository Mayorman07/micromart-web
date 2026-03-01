import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const CartDrawer = ({ isOpen, onClose, cartItems = [], onUpdateQuantity, onRemoveItem }) => {
    const { isDark } = useTheme();

    // Calculate subtotal
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <>
            {/* 1. Backdrop Overlay */}
            <div 
                className={`fixed inset-0 z-[60] transition-opacity duration-500 bg-black/40 backdrop-blur-sm
                    ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* 2. Side Panel */}
            <div className={`fixed top-0 right-0 h-full z-[70] w-full max-w-md shadow-2xl transition-transform duration-500 ease-in-out
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                ${isDark ? 'bg-[#0d1425] text-white border-l border-white/5' : 'bg-white text-gray-900 border-l border-gray-100'}`}>
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-3">
                        <ShoppingBag size={20} className={isDark ? 'text-cyan-400' : 'text-cyan-600'} />
                        <h2 className={`text-lg font-black uppercase tracking-tighter ${!isDark && 'font-serif italic capitalize'}`}>
                            Your Registry
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:rotate-90 transition-transform duration-300">
                        <X size={24} />
                    </button>
                </div>

                {/* Cart Items List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 h-[calc(100vh-280px)]">
                    {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                            <div key={item.skuCode} className="flex gap-4 group">
                                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-white/5">
                                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h4 className={`text-xs font-bold uppercase leading-tight mb-1 ${!isDark && 'font-serif italic normal-case'}`}>
                                        {item.name}
                                    </h4>
                                    <p className={`text-[10px] font-black mb-3 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                                        ${item.price}
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center border border-gray-200 dark:border-white/10 rounded-lg">
                                            <button onClick={() => onUpdateQuantity(item.skuCode, item.quantity - 1)} className="p-1 hover:text-cyan-500"><Minus size={12} /></button>
                                            <span className="px-2 text-[10px] font-bold">{item.quantity}</span>
                                            <button onClick={() => onUpdateQuantity(item.skuCode, item.quantity + 1)} className="p-1 hover:text-cyan-500"><Plus size={12} /></button>
                                        </div>
                                        <button onClick={() => onRemoveItem(item.skuCode)} className="text-gray-400 hover:text-red-500 transition-colors">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center opacity-40">
                            <ShoppingBag size={48} strokeWidth={1} />
                            <p className="mt-4 text-[10px] uppercase font-bold tracking-widest">Registry Empty</p>
                        </div>
                    )}
                </div>

                {/* Footer / Checkout */}
                <div className={`absolute bottom-0 left-0 right-0 p-8 border-t transition-colors
                    ${isDark ? 'bg-[#0a0f1d] border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Total Amount</span>
                        <span className={`text-xl font-black ${isDark ? 'text-cyan-400' : 'text-gray-900'}`}>
                            ${subtotal.toFixed(2)}
                        </span>
                    </div>
                    <button className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all
                        ${isDark 
                            ? 'bg-white text-black hover:bg-cyan-500 shadow-lg shadow-cyan-500/20' 
                            : 'bg-cyan-500 text-white hover:bg-cyan-600 shadow-xl shadow-cyan-500/20'}`}>
                        Authorize Purchase
                    </button>
                    <p className="text-[8px] text-center mt-4 opacity-40 uppercase tracking-tighter">
                        Secure transaction via MicroMart Distributed Systems
                    </p>
                </div>
            </div>
        </>
    );
};

export default CartDrawer;