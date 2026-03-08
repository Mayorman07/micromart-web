import { useState } from "react";
import { X, Plus, Minus, Trash2, ShoppingBag, Trash } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

/**
 * CartDrawer Component
 * * Displays a sliding side panel containing the user's current selected items.
 * Handles item quantity adjustments, removal, and the initiation of the checkout process.
 * * @param {boolean} isOpen - Controls the visibility of the drawer.
 * @param {function} onClose - Callback to close the drawer.
 * @param {Array} cartItems - Array of product objects currently in the cart.
 * @param {function} onUpdateQuantity - Callback to modify the quantity of a specific SKU.
 * @param {function} onRemoveItem - Callback to remove a specific SKU from the cart.
 * @param {function} onClearCart - Callback to empty the entire cart.
 */
const CartDrawer = ({ 
    isOpen, 
    onClose, 
    cartItems = [], 
    onUpdateQuantity, 
    onRemoveItem,
    onClearCart 
}) => {
    const { isDark } = useTheme();
    
    // Tracks the active state of the checkout API request to prevent duplicate submissions
    const [isProcessing, setIsProcessing] = useState(false);

    // Calculate the cumulative total of all items currently in the registry
    const subtotal = cartItems.reduce((acc, item) => {
        const price = item.unitPrice || 0;
        const qty = item.quantity || 0;
        return acc + (price * qty);
    }, 0);

    /**
     * Initiates the payment process by communicating with the Payment microservice.
     * Constructs the required DTO, handles the API transaction, and redirects to the 
     * external payment gateway (Stripe) upon success.
     */
    const handleAuthorizePurchase = async () => {
        setIsProcessing(true);

        try {
            // Retrieve the active authorization token from local storage
            const token = localStorage.getItem("token"); 

            // TODO: Replace mock order ID generation once the Order Service integration is complete
            const tempOrderId = `ORD-MOCK-${Math.floor(Math.random() * 1000000)}`;
            
            // TODO: Extract authenticated user email dynamically from context or JWT payload
            const userEmail = "mayowa.hyde@gmail.com"; 

            // Map local cart state to the expected OrderItemDto structure defined in the backend
            const formattedItems = cartItems.map(item => ({
                skuCode: item.skuCode,
                productName: item.productName,
                imageUrl: item.imageUrl,
                unitPrice: item.unitPrice,
                quantity: item.quantity
            }));

            // Construct the comprehensive PaymentRequest payload
            const payload = {
                orderId: tempOrderId,
                userEmail: userEmail,
                totalAmount: subtotal,
                currency: "USD",
                paymentMethod: "STRIPE",
                items: formattedItems
            };

            // Execute the transaction against the Payment Service gateway
            const response = await fetch("http://127.0.0.1:7082/payment/api/payments/initiate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Payment initiation failed. Please try again.");
            }

            const data = await response.json();

            // Redirect the client to the generated Stripe Checkout session URL
            if (data.paymentUrl) {
                window.location.href = data.paymentUrl;
            } else {
                throw new Error("Invalid response: Missing payment gateway URL.");
            }

        } catch (error) {
            console.error("Checkout transaction error:", error);
            // Fallback error alert - to be replaced with global UI toast notifications
            alert(`Checkout failed: ${error.message}`); 
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            {/* --- Backdrop Overlay --- */}
            <div 
                className={`fixed inset-0 z-[60] transition-opacity duration-500 bg-black/40 backdrop-blur-sm
                    ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* --- Drawer Container --- */}
            <div className={`fixed top-0 right-0 h-full z-[70] w-full max-w-md shadow-2xl transition-transform duration-500 ease-in-out
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                ${isDark ? 'bg-[#0d1425] text-white border-l border-white/5' : 'bg-white text-gray-900 border-l border-gray-100'}`}>
                
                {/* Header Section */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-3">
                        <ShoppingBag size={20} className={isDark ? 'text-cyan-400' : 'text-cyan-600'} />
                        <h2 className={`text-lg font-black uppercase tracking-tighter ${!isDark && 'font-serif italic capitalize'}`}>
                            Your Registry
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        {cartItems.length > 0 && (
                            <button 
                                onClick={onClearCart}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                                title="Clear All"
                                disabled={isProcessing}
                            >
                                <Trash size={18} />
                            </button>
                        )}
                        <button onClick={onClose} disabled={isProcessing} className="p-2 hover:rotate-90 transition-transform duration-300 disabled:opacity-50">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Cart Items List Section */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 h-[calc(100vh-280px)]">
                    {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                            <div key={item.skuCode} className="flex gap-4 group">
                                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex-shrink-0">
                                    <img 
                                        src={item.imageUrl || 'https://placehold.co/200x200'} 
                                        alt={item.productName} 
                                        className="w-full h-full object-cover" 
                                    />
                                </div>
                                <div className="flex-1">
                                    <h4 className={`text-xs font-bold uppercase leading-tight mb-1 line-clamp-2 ${!isDark && 'font-serif italic normal-case'}`}>
                                        {item.productName}
                                    </h4>
                                    <p className={`text-[10px] font-black mb-3 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                                        ${item.unitPrice?.toFixed(2)}
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center border border-gray-200 dark:border-white/10 rounded-lg">
                                            <button 
                                                onClick={() => onUpdateQuantity(item.skuCode, item.quantity - 1)} 
                                                disabled={isProcessing}
                                                className="p-1 hover:text-cyan-500 transition-colors disabled:opacity-50"
                                            >
                                                <Minus size={12} />
                                            </button>
                                            <span className="px-2 text-[10px] font-bold min-w-[20px] text-center">
                                                {item.quantity}
                                            </span>
                                            <button 
                                                onClick={() => onUpdateQuantity(item.skuCode, item.quantity + 1)} 
                                                disabled={isProcessing}
                                                className="p-1 hover:text-cyan-500 transition-colors disabled:opacity-50"
                                            >
                                                <Plus size={12} />
                                            </button>
                                        </div>
                                        <button 
                                            onClick={() => onRemoveItem(item.skuCode)}
                                            disabled={isProcessing} 
                                            className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                                        >
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

                {/* Footer & Checkout Action Section */}
                <div className={`absolute bottom-0 left-0 right-0 p-8 border-t transition-colors
                    ${isDark ? 'bg-[#0a0f1d] border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Total Amount</span>
                        <span className={`text-xl font-black ${isDark ? 'text-cyan-400' : 'text-gray-900'}`}>
                            ${subtotal.toFixed(2)}
                        </span>
                    </div>
                    
                    <button 
                        onClick={handleAuthorizePurchase}
                        disabled={cartItems.length === 0 || isProcessing}
                        className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2
                        ${isDark 
                            ? 'bg-white text-black hover:bg-cyan-500 disabled:bg-gray-800 disabled:text-gray-500 shadow-lg shadow-cyan-500/20' 
                            : 'bg-cyan-500 text-white hover:bg-cyan-600 disabled:bg-cyan-200 shadow-xl shadow-cyan-500/20'}`}
                    >
                        {isProcessing ? (
                            <>
                                <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                                Processing...
                            </>
                        ) : (
                            'Authorize Purchase'
                        )}
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