import { useState } from "react";
import { X, CreditCard, Bitcoin, Building2, Copy, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const PaymentModal = ({ isOpen, onClose, cartItems, totalAmount }) => {
    const { isDark } = useTheme();
    const [selectedMethod, setSelectedMethod] = useState("STRIPE");
    const [isProcessing, setIsProcessing] = useState(false);
    
    // UI Flow States
    const [cryptoStep, setCryptoStep] = useState("SELECT"); 
    const [bankStep, setBankStep] = useState("SELECT");     
    const [copied, setCopied] = useState(false);

    // Data from Backend Strategies
    const [paymentDetails, setPaymentDetails] = useState(null);

    if (!isOpen) return null;

    const handleCopy = (textToCopy) => {
        if (!textToCopy) return;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const initiatePayment = async (method) => {
        setIsProcessing(true);
        try {
            const token = localStorage.getItem("token");
            const userEmail = "mayowa.hyde@gmail.com"; 

            const formattedItems = cartItems.map(item => ({
                skuCode: item.skuCode,
                productName: item.productName,
                imageUrl: item.imageUrl,
                unitPrice: item.unitPrice,
                quantity: item.quantity
            }));

            // --- STEP 1: CREATE REAL ORDER IN DATABASE ---
            const orderResponse = await fetch("http://127.0.0.1:7082/order/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { "Authorization": `Bearer ${token}` })
                },
                body: JSON.stringify({
                    userEmail,
                    totalAmount,
                    currency: "USD",
                    paymentMethod: method,
                    items: formattedItems
                })
            });

            if (!orderResponse.ok) throw new Error("Order Service Error: Registration failed");
            const orderData = await orderResponse.json();

            // --- STEP 2: TRIGGER PAYMENT STRATEGY ---
            const response = await fetch("http://127.0.0.1:7082/payment/api/payments/initiate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    ...(token && { "Authorization": `Bearer ${token}` })
                },
                body: JSON.stringify({
                    orderId: orderData.orderNumber,
                    userEmail,
                    totalAmount,
                    currency: "USD",
                    paymentMethod: method,
                    items: formattedItems
                })
            });

            if (!response.ok) throw new Error("Payment Strategy Error: Initiation failed");
            const data = await response.json(); 
            
            setPaymentDetails(data); 

            // --- STEP 3: TRANSITION UI ---
            if (method === "STRIPE") {
                window.location.href = data.paymentUrl;
            } else if (method === "CRYPTO") {
                setCryptoStep("ADDRESS");
            } else if (method === "BANK_TRANSFER") {
                setBankStep("DETAILS");
            }
            setIsProcessing(false);

        } catch (error) {
            console.error("Workflow Error:", error);
            alert(error.message);
            setIsProcessing(false);
        }
    };

    const handleTabChange = (method) => {
        setSelectedMethod(method);
        setCryptoStep("SELECT");
        setBankStep("SELECT");
        setPaymentDetails(null);
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className={`relative w-full max-w-3xl h-[560px] flex rounded-2xl shadow-2xl overflow-hidden
                ${isDark ? 'bg-[#0d1425] text-white border border-white/10' : 'bg-white text-gray-900'}`}>
                
                {/* Left Sidebar */}
                <div className={`w-1/3 p-6 flex flex-col border-r 
                    ${isDark ? 'bg-[#0a0f1d] border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                    
                    <div className="mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center font-black text-white">M</div>
                            <div>
                                <h3 className="font-black tracking-tight text-sm uppercase">MicroMart</h3>
                                <div className="flex items-center gap-1 text-[9px] text-emerald-500 font-bold uppercase">
                                    <ShieldCheck size={10} /> Secure
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {[
                            { id: "STRIPE", label: "Card", icon: <CreditCard size={18} /> },
                            { id: "CRYPTO", label: "Crypto", icon: <Bitcoin size={18} /> },
                            { id: "BANK_TRANSFER", label: "Bank", icon: <Building2 size={18} /> }
                        ].map((m) => (
                            <button 
                                key={m.id}
                                onClick={() => handleTabChange(m.id)} 
                                className={`w-full flex items-center gap-3 p-4 rounded-xl text-sm font-bold transition-all 
                                ${selectedMethod === m.id ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'opacity-50 hover:opacity-100'}`}
                            >
                                {m.icon} {m.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Content Area */}
                <div className="w-2/3 p-8 relative flex flex-col overflow-y-auto">
                    <button onClick={onClose} className="absolute top-6 right-6 opacity-40 hover:opacity-100"><X size={20} /></button>

                    <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
                        
                        {/* --- STRIPE VIEW --- */}
                        {selectedMethod === "STRIPE" && (
                            <div className="text-center space-y-6">
                                <div>
                                    <p className="text-xs uppercase tracking-widest opacity-50 mb-1">Payable Total</p>
                                    <h2 className="text-4xl font-black">${totalAmount.toFixed(2)}</h2>
                                </div>
                                <button onClick={() => initiatePayment("STRIPE")} disabled={isProcessing} className="w-full py-4 rounded-xl bg-cyan-500 text-white font-bold tracking-widest hover:bg-cyan-600 disabled:opacity-50 flex justify-center items-center gap-2">
                                    {isProcessing ? <Loader2 className="animate-spin" size={18} /> : 'CHECKOUT WITH CARD'}
                                </button>
                            </div>
                        )}

                        {/* --- CRYPTO VIEW --- */}
                        {selectedMethod === "CRYPTO" && (
                            <div className="w-full">
                                {cryptoStep === "SELECT" ? (
                                    <div className="text-center space-y-6">
                                        <h2 className="text-3xl font-black">${totalAmount.toFixed(2)}</h2>
                                        <p className="text-xs opacity-60">Instant crypto settlement. Generate your unique wallet address below.</p>
                                        <button onClick={() => initiatePayment("CRYPTO")} disabled={isProcessing} className="w-full py-4 rounded-xl bg-cyan-500 text-white font-bold tracking-widest flex justify-center items-center gap-2">
                                            {isProcessing ? <Loader2 className="animate-spin" size={18} /> : 'GENERATE WALLET'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="bg-white p-3 rounded-xl inline-block shadow-sm mx-auto">
                                            <img src={paymentDetails?.paymentUrl} alt="QR Code" className="w-32 h-32" />
                                        </div>
                                        <div className={`p-5 rounded-2xl border text-left space-y-3 ${isDark ? 'bg-black/20 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                                            <p className="text-[11px] leading-relaxed whitespace-pre-line font-medium opacity-80">
                                                {paymentDetails?.instructions}
                                            </p>
                                            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                                                <div>
                                                    <p className="text-[9px] font-bold text-cyan-500 uppercase">System TxHash</p>
                                                    <p className="font-mono text-xs truncate max-w-[180px]">{paymentDetails?.sessionId}</p>
                                                </div>
                                                <button onClick={() => handleCopy(paymentDetails?.sessionId)} className="p-2 text-cyan-500 hover:bg-white/5 rounded-lg"><Copy size={16} /></button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* --- BANK TRANSFER VIEW --- */}
                        {selectedMethod === "BANK_TRANSFER" && (
                            <div className="w-full">
                                {bankStep === "SELECT" ? (
                                    <div className="text-center space-y-6">
                                        <h2 className="text-3xl font-black">${totalAmount.toFixed(2)}</h2>
                                        <p className="text-xs opacity-60">Manual bank verification. Generate a transfer reference to proceed.</p>
                                        <button onClick={() => initiatePayment("BANK_TRANSFER")} disabled={isProcessing} className="w-full py-4 rounded-xl bg-cyan-500 text-white font-bold tracking-widest flex justify-center items-center gap-2">
                                            {isProcessing ? <Loader2 className="animate-spin" size={18} /> : 'GET TRANSFER DETAILS'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className={`p-5 rounded-2xl border text-left space-y-3 ${isDark ? 'bg-black/20 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                                            <div className="flex items-center gap-2 text-cyan-500 mb-1">
                                                <Building2 size={14} />
                                                <span className="text-[10px] font-black uppercase tracking-wider">Settlement Instructions</span>
                                            </div>
                                            <p className="text-[11px] leading-relaxed whitespace-pre-line font-bold">
                                                {paymentDetails?.instructions}
                                            </p>
                                        </div>

                                        <div className="relative group">
                                            <div className={`relative flex items-center justify-between p-4 rounded-2xl border 
                                                ${isDark ? 'bg-[#0a0f1d] border-cyan-500/30' : 'bg-white border-cyan-200 shadow-sm'}`}>
                                                <div>
                                                    <p className="text-[9px] font-bold text-cyan-500 uppercase tracking-widest mb-1">Transfer Reference</p>
                                                    <p className="font-mono font-black text-xl text-cyan-500 tracking-tighter">
                                                        {paymentDetails?.sessionId}
                                                    </p>
                                                </div>
                                                <button onClick={() => handleCopy(paymentDetails?.sessionId)} className="p-3 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-xl transition-all">
                                                    {copied ? <CheckCircle2 className="text-emerald-500" size={20} /> : <Copy size={20} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center gap-2 text-[10px] opacity-40 uppercase font-black tracking-tighter">
                                            <Loader2 size={12} className="animate-spin" /> Awaiting reflection on ledger
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="mt-auto pt-4 text-center border-t border-white/5">
                        <p className="text-[9px] opacity-30 uppercase tracking-widest flex items-center justify-center gap-2 font-bold">
                            Vault Secure Processing <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;