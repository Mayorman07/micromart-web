import { useState, useEffect } from "react";
import { X, CreditCard, Bitcoin, Building2, Copy, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const PaymentModal = ({ isOpen, onClose, cartItems, totalAmount }) => {
    const { isDark } = useTheme();
    const [selectedMethod, setSelectedMethod] = useState("STRIPE");
    const [isProcessing, setIsProcessing] = useState(false);
    const [cryptoStep, setCryptoStep] = useState("SELECT"); 
    const [bankStep, setBankStep] = useState("SELECT");     
    const [copied, setCopied] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState(null);

    // --- POLLING LOGIC ---
    useEffect(() => {
        let pollInterval;

        // Only poll if we have a session ID and it's a manual method (Bank/Crypto)
        if (paymentDetails?.sessionId && selectedMethod !== "STRIPE") {
            console.log("Polling started for reference:", paymentDetails.sessionId);

            pollInterval = setInterval(async () => {
                try {
                    const response = await fetch(`http://127.0.0.1:7082/payment/api/payments/status/${paymentDetails.sessionId}`);
                    if (response.ok) {
                        const data = await response.json();
                        console.log("Status Check:", data.status);

                        // If status is PAID, redirect to success page
                        if (data.status === "PAID" || data.status === "SUCCESS" || data.status === "COMPLETED") {
                            clearInterval(pollInterval);
                            onClose();
                            window.location.href = `/payment/success?orderId=${paymentDetails.sessionId}`;
                        }
                    }
                } catch (error) {
                    console.error("Polling error:", error);
                }
            }, 5000); // 5 second intervals
        }

        // Cleanup: clear timer if user closes modal or switches methods
        return () => {
            if (pollInterval) clearInterval(pollInterval);
        };
    }, [paymentDetails, selectedMethod, onClose]);

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
            const formattedItems = cartItems.map(item => ({
                skuCode: item.skuCode,
                productName: item.productName,
                imageUrl: item.imageUrl,
                unitPrice: item.unitPrice,
                quantity: item.quantity
            }));

            // 1. Create Order
            const orderRes = await fetch("http://127.0.0.1:7082/order/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json", ...(token && { "Authorization": `Bearer ${token}` }) },
                body: JSON.stringify({ userEmail: "mayowa.hyde@gmail.com", totalAmount, currency: "USD", paymentMethod: method, items: formattedItems })
            });
            if (!orderRes.ok) throw new Error("Order creation failed");
            const orderData = await orderRes.json();

            // 2. Initiate Payment
            const payRes = await fetch("http://127.0.0.1:7082/payment/api/payments/initiate", {
                method: "POST",
                headers: { "Content-Type": "application/json", ...(token && { "Authorization": `Bearer ${token}` }) },
                body: JSON.stringify({ orderId: orderData.orderNumber, userEmail: "mayowa.hyde@gmail.com", totalAmount, currency: "USD", paymentMethod: method, items: formattedItems })
            });
            if (!payRes.ok) throw new Error("Payment initiation failed");
            const data = await payRes.json();
            
            setPaymentDetails(data);
            if (method === "STRIPE") window.location.href = data.paymentUrl;
            else if (method === "CRYPTO") setCryptoStep("ADDRESS");
            else if (method === "BANK_TRANSFER") setBankStep("DETAILS");
            setIsProcessing(false);
        } catch (err) {
            alert(err.message);
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
            <div className={`relative w-full max-w-3xl h-[560px] flex rounded-2xl shadow-2xl overflow-hidden ${isDark ? 'bg-[#0d1425] text-white border border-white/10' : 'bg-white text-gray-900'}`}>
                
                {/* Sidebar */}
                <div className={`w-1/3 p-6 flex flex-col border-r ${isDark ? 'bg-[#0a0f1d] border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                    <div className="mb-8 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center font-black text-white">M</div>
                        <div>
                            <h3 className="font-black text-sm uppercase">MicroMart</h3>
                            <div className="flex items-center gap-1 text-[9px] text-emerald-500 font-bold uppercase"><ShieldCheck size={10} /> Secure</div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {[{id:"STRIPE", label:"Card", icon:<CreditCard size={18}/>}, {id:"CRYPTO", label:"Crypto", icon:<Bitcoin size={18}/>}, {id:"BANK_TRANSFER", label:"Bank", icon:<Building2 size={18}/>}].map(m => (
                            <button key={m.id} onClick={() => handleTabChange(m.id)} className={`w-full flex items-center gap-3 p-4 rounded-xl text-sm font-bold transition-all ${selectedMethod === m.id ? 'bg-cyan-500 text-white shadow-lg' : 'opacity-50 hover:opacity-100'}`}>
                                {m.icon} {m.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="w-2/3 p-8 relative flex flex-col overflow-y-auto">
                    <button onClick={onClose} className="absolute top-6 right-6 opacity-40 hover:opacity-100"><X size={20} /></button>
                    <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
                        
                        {selectedMethod === "STRIPE" && (
                            <div className="text-center space-y-6">
                                <h2 className="text-4xl font-black">${totalAmount.toFixed(2)}</h2>
                                <button onClick={() => initiatePayment("STRIPE")} disabled={isProcessing} className="w-full py-4 rounded-xl bg-cyan-500 text-white font-bold flex justify-center gap-2">
                                    {isProcessing ? <Loader2 className="animate-spin" size={18} /> : 'CHECKOUT WITH CARD'}
                                </button>
                            </div>
                        )}

                        {selectedMethod === "CRYPTO" && (
                            <div className="w-full text-center">
                                {cryptoStep === "SELECT" ? (
                                    <div className="space-y-6">
                                        <h2 className="text-3xl font-black">${totalAmount.toFixed(2)}</h2>
                                        <button onClick={() => initiatePayment("CRYPTO")} disabled={isProcessing} className="w-full py-4 rounded-xl bg-cyan-500 text-white font-bold flex justify-center gap-2">
                                            {isProcessing ? <Loader2 className="animate-spin" size={18} /> : 'GENERATE WALLET'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                                        <div className="bg-white p-3 rounded-xl inline-block shadow-sm"><img src={paymentDetails?.paymentUrl} alt="QR" className="w-32 h-32" /></div>
                                        <div className={`p-5 rounded-2xl border text-left ${isDark ? 'bg-black/20 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                            <p className="text-[11px] leading-relaxed whitespace-pre-line font-bold opacity-80">{paymentDetails?.instructions}</p>
                                            <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                                                <div><p className="text-[9px] font-bold text-cyan-500 uppercase">System Reference</p><p className="font-mono text-xs truncate max-w-[180px] font-bold">{paymentDetails?.sessionId}</p></div>
                                                <button onClick={() => handleCopy(paymentDetails?.sessionId)} className="p-2 text-cyan-500 hover:bg-cyan-500/10 rounded-lg"><Copy size={16} /></button>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-center gap-2 text-[10px] opacity-40 uppercase font-black"><Loader2 size={12} className="animate-spin" /> Verifying Transfer</div>
                                    </div>
                                )}
                            </div>
                        )}

                        {selectedMethod === "BANK_TRANSFER" && (
                            <div className="w-full">
                                {bankStep === "SELECT" ? (
                                    <div className="text-center space-y-6">
                                        <h2 className="text-3xl font-black">${totalAmount.toFixed(2)}</h2>
                                        <button onClick={() => initiatePayment("BANK_TRANSFER")} disabled={isProcessing} className="w-full py-4 rounded-xl bg-cyan-500 text-white font-bold flex justify-center gap-2">
                                            {isProcessing ? <Loader2 className="animate-spin" size={18} /> : 'GENERATE VIRTUAL ACCOUNT'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                                        <div className={`p-6 rounded-2xl border-2 border-dashed ${isDark ? 'bg-cyan-500/5 border-cyan-500/20' : 'bg-gray-50 border-gray-200'}`}>
                                            <div className="flex justify-between items-start mb-6"><Building2 className="text-cyan-500" size={24} /><span className="text-[10px] font-black bg-emerald-500/20 text-emerald-500 px-2 py-1 rounded tracking-tighter">VIRTUAL ACCOUNT</span></div>
                                            <div className="space-y-4">
                                                <div><p className="text-[10px] uppercase opacity-50 font-bold">Receiving Bank</p><p className="font-bold text-sm">Mayorman Microfinance Bank</p></div>
                                                <div className="flex justify-between items-end">
                                                    <div><p className="text-[10px] uppercase opacity-50 font-bold">Account Number</p><p className="font-mono text-2xl font-black text-cyan-500 tracking-widest">0127753007</p></div>
                                                    <button onClick={() => handleCopy("0127753007")} className="p-2 text-cyan-500 hover:bg-cyan-500/10 rounded-lg"><Copy size={20} /></button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`p-4 rounded-xl border ${isDark ? 'bg-black/40 border-white/5' : 'bg-white shadow-sm'}`}>
                                            <div className="flex justify-between items-center">
                                                <div><p className="text-[9px] font-bold opacity-50 uppercase">Payment Reference (Required)</p><p className="font-mono font-bold text-sm text-cyan-500 uppercase">{paymentDetails?.sessionId}</p></div>
                                                <button onClick={() => handleCopy(paymentDetails?.sessionId)}>{copied ? <CheckCircle2 className="text-emerald-500" size={18} /> : <Copy size={18} className="opacity-50" />}</button>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-center gap-2 text-[10px] opacity-40 uppercase font-black"><Loader2 size={12} className="animate-spin" /> Awaiting network reflection</div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="mt-auto pt-4 text-center border-t border-white/5 opacity-30 text-[9px] uppercase font-bold">Vault Secure Processing <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse ml-1" /></div>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;