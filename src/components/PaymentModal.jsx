import { useState, useEffect } from "react";
import { X, CreditCard, Bitcoin, Building2, Copy, CheckCircle2, Loader2, ShieldCheck, MapPin } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import api from "../services/api"; // 

const PaymentModal = ({ isOpen, onClose, cartItems, totalAmount }) => {
    const { isDark } = useTheme();
    const [selectedMethod, setSelectedMethod] = useState("STRIPE");
    const [isProcessing, setIsProcessing] = useState(false);
    const [cryptoStep, setCryptoStep] = useState("SELECT"); 
    const [bankStep, setBankStep] = useState("SELECT");     
    const [copied, setCopied] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState(null);
    
    // Retrieve local registry context
    const userEmail = localStorage.getItem("userEmail") || "mayowa.hyde@gmail.com";

    useEffect(() => {
        let pollInterval;
        if (paymentDetails?.sessionId && selectedMethod !== "STRIPE") {
            pollInterval = setInterval(async () => {
                try {
                    const response = await api.get(`/payment/api/payments/status/${paymentDetails.sessionId}`);
                    if (response.data.status === "PAID" || response.data.status === "SUCCESS") {
                        clearInterval(pollInterval);
                        onClose();
                        window.location.href = `/payment/success?orderId=${paymentDetails.sessionId}`;
                    }
                } catch (error) {
                    console.error("Polling sync lost:", error);
                }
            }, 5000);
        }
        return () => { if (pollInterval) clearInterval(pollInterval); };
    }, [paymentDetails, selectedMethod, onClose]);

    if (!isOpen) return null;

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const initiatePayment = async (method) => {
        setIsProcessing(true);
        try {
            const formattedItems = cartItems.map(item => ({
                skuCode: item.skuCode,
                productName: item.productName,
                unitPrice: item.unitPrice,
                quantity: item.quantity
            }));

            // 1. Synchronize Order Registry
            const orderRes = await api.post("/order/api/orders", {
                userEmail, totalAmount, currency: "USD", paymentMethod: method, items: formattedItems
            });

            // 2. Initialize Payment Gateway
            const payRes = await api.post("/payment/api/payments/initiate", {
                orderId: orderRes.data.orderNumber, userEmail, totalAmount, currency: "USD", paymentMethod: method, items: formattedItems
            });
            
            setPaymentDetails(payRes.data);
            if (method === "STRIPE") window.location.href = payRes.data.paymentUrl;
            else if (method === "CRYPTO") setCryptoStep("ADDRESS");
            else if (method === "BANK_TRANSFER") setBankStep("DETAILS");
        } catch (err) {
            console.error("Auth Failure:", err);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
            
            <div className={`relative w-full max-w-4xl h-[600px] flex rounded-[2rem] shadow-3xl overflow-hidden border transition-all duration-500 ${isDark ? 'bg-[#0a0f1d] border-white/10' : 'bg-white border-gray-200'}`}>
                
                {/* Tactical Sidebar: Logistics & Methods */}
                <div className={`w-[320px] p-8 flex flex-col border-r ${isDark ? 'bg-black/20 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                    <header className="mb-10">
                        <div className="flex items-center gap-2 mb-1">
                            <ShieldCheck size={14} className="text-cyan-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500">Secure Vault</span>
                        </div>
                        <h3 className="text-xl font-black uppercase italic tracking-tight">Authorization</h3>
                    </header>

                    {/* Method Selector */}
                    <nav className="space-y-3 mb-10">
                        {[{id:"STRIPE", label:"Global Card", icon:<CreditCard size={16}/>}, 
                          {id:"CRYPTO", label:"Crypto Asset", icon:<Bitcoin size={16}/>}, 
                          {id:"BANK_TRANSFER", label:"Local Wire", icon:<Building2 size={16}/>}].map(m => (
                            <button 
                                key={m.id} 
                                onClick={() => setSelectedMethod(m.id)} 
                                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${selectedMethod === m.id ? 'bg-cyan-500 border-cyan-500 text-black shadow-[0_10px_30px_rgba(6,182,212,0.3)]' : 'border-transparent opacity-40 hover:opacity-100 font-bold'}`}
                            >
                                <span className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest">{m.icon} {m.label}</span>
                                {selectedMethod === m.id && <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />}
                            </button>
                        ))}
                    </nav>

                    {/* Logistics Summary Integration */}
                    <div className="mt-auto pt-6 border-t border-white/5">
                        <div className="flex items-center gap-2 mb-3 opacity-40">
                            <MapPin size={12} />
                            <span className="text-[9px] font-black uppercase tracking-widest">Destination Registry</span>
                        </div>
                        <p className="text-[10px] font-bold text-gray-500 leading-relaxed uppercase tracking-tighter italic">
                            Verified Shipping Coordinates Active. Final logistics reflection applied at checkout.
                        </p>
                    </div>
                </div>

                {/* Content HUD */}
                <div className="flex-1 p-10 relative flex flex-col items-center justify-center">
                    <button onClick={onClose} className="absolute top-8 right-8 p-2 rounded-full hover:bg-white/5 transition-colors opacity-40"><X size={20} /></button>
                    
                    <div className="w-full max-w-sm">
                        {selectedMethod === "STRIPE" && (
                            <div className="text-center animate-in fade-in zoom-in-95 duration-500">
                                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 mb-2 block">Total Deployment Value</span>
                                <h2 className="text-7xl font-black tracking-tighter italic mb-10">${totalAmount.toFixed(2)}</h2>
                                <button onClick={() => initiatePayment("STRIPE")} disabled={isProcessing} className="w-full py-5 rounded-2xl bg-white text-black text-[11px] font-black uppercase tracking-[0.3em] hover:bg-cyan-500 transition-all flex items-center justify-center gap-3">
                                    {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <>INITIALIZE STRIPE SECURE <CreditCard size={14}/></>}
                                </button>
                            </div>
                        )}

                        {selectedMethod === "CRYPTO" && (
                            <div className="text-center">
                                {cryptoStep === "SELECT" ? (
                                    <div className="animate-in fade-in duration-500">
                                        <h2 className="text-5xl font-black italic mb-10">${totalAmount.toFixed(2)}</h2>
                                        <button onClick={() => initiatePayment("CRYPTO")} disabled={isProcessing} className="w-full py-5 rounded-2xl bg-cyan-500 text-black text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3">
                                            {isProcessing ? <Loader2 className="animate-spin" /> : "GENERATE WALLET ADDRESS"}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-500">
                                        <div className="bg-white p-4 rounded-3xl inline-block shadow-2xl border-4 border-cyan-500/20"><img src={paymentDetails?.paymentUrl} alt="QR" className="w-36 h-36" /></div>
                                        <div className="bg-black/40 border border-white/5 p-6 rounded-2xl text-left space-y-4">
                                            <p className="text-[11px] font-mono leading-relaxed opacity-60 text-cyan-200 uppercase">{paymentDetails?.instructions}</p>
                                            <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                                <div className="overflow-hidden">
                                                    <p className="text-[9px] font-black text-cyan-500 uppercase mb-1">TX-ID Reference</p>
                                                    <p className="font-mono text-xs truncate text-white">{paymentDetails?.sessionId}</p>
                                                </div>
                                                <button onClick={() => handleCopy(paymentDetails?.sessionId)} className="p-3 bg-white/5 hover:bg-cyan-500/20 rounded-xl text-cyan-500"><Copy size={16} /></button>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 animate-pulse">
                                            <Loader2 size={12} className="animate-spin" /> Synchronizing network reflection...
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {selectedMethod === "BANK_TRANSFER" && (
                            <div className="text-center">
                                {bankStep === "SELECT" ? (
                                    <div className="animate-in fade-in duration-500">
                                        <h2 className="text-5xl font-black italic mb-10">${totalAmount.toFixed(2)}</h2>
                                        <button onClick={() => initiatePayment("BANK_TRANSFER")} disabled={isProcessing} className="w-full py-5 rounded-2xl bg-cyan-500 text-black text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3">
                                            {isProcessing ? <Loader2 className="animate-spin" /> : "ASSIGN VIRTUAL ACCOUNT"}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-500">
                                        <div className="bg-black/40 border-2 border-dashed border-cyan-500/30 p-8 rounded-3xl text-left">
                                            <div className="flex justify-between items-start mb-6"><Building2 className="text-cyan-500" size={32} /><span className="text-[9px] font-black bg-cyan-500 text-black px-3 py-1 rounded-full tracking-widest uppercase">Direct Wire</span></div>
                                            <div className="space-y-5">
                                                <div><p className="text-[9px] uppercase font-black opacity-30 tracking-widest">Bank Entity</p><p className="font-black text-lg tracking-tight uppercase italic">Mayorman Microfinance</p></div>
                                                <div className="flex justify-between items-end">
                                                    <div><p className="text-[9px] uppercase font-black opacity-30 tracking-widest">Asset Account</p><p className="font-mono text-3xl font-black text-cyan-500 tracking-widest">0127753007</p></div>
                                                    <button onClick={() => handleCopy("0127753007")} className="p-3 bg-white/5 rounded-xl text-cyan-500"><Copy size={20} /></button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-black/20 border border-white/5 p-4 rounded-xl flex justify-between items-center text-left">
                                            <div><p className="text-[8px] font-black opacity-30 uppercase mb-1">Payment ID</p><p className="font-mono text-xs font-bold text-cyan-500">{paymentDetails?.sessionId}</p></div>
                                            <button onClick={() => handleCopy(paymentDetails?.sessionId)} className="text-cyan-500">{copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    
                    <footer className="absolute bottom-10 inset-x-0 flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">
                            <ShieldCheck size={12} className="text-emerald-500" /> Layer 7 End-to-End Encryption Active
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;