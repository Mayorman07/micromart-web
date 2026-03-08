import { useState } from "react";
import { X, CreditCard, Bitcoin, Building2, Copy, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const PaymentModal = ({ isOpen, onClose, cartItems, totalAmount }) => {
    const { isDark } = useTheme();
    const [selectedMethod, setSelectedMethod] = useState("STRIPE");
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Step states for different flows
    const [cryptoStep, setCryptoStep] = useState("SELECT"); // 'SELECT' | 'ADDRESS'
    const [bankStep, setBankStep] = useState("SELECT");     // 'SELECT' | 'DETAILS'
    const [copied, setCopied] = useState(false);

    // Mock Data
    const mockWalletAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";
    const mockBankDetails = {
        bankName: " Big Homie Trust Bank",
        accountName: "MicroMart Technologies",
        accountNumber: "9876543210"
    };

    if (!isOpen) return null;

    // Generic copy function for wallet addresses & account numbers
    const handleCopy = (textToCopy) => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const initiatePayment = async (method) => {
        setIsProcessing(true);
        try {
            const token = localStorage.getItem("token");
            const tempOrderId = `ORD-MOCK-${Math.floor(Math.random() * 1000000)}`;
            const userEmail = "mayowa.hyde@gmail.com"; 

            const formattedItems = cartItems.map(item => ({
                skuCode: item.skuCode,
                productName: item.productName,
                imageUrl: item.imageUrl,
                unitPrice: item.unitPrice,
                quantity: item.quantity
            }));

            const payload = {
                orderId: tempOrderId,
                userEmail: userEmail,
                totalAmount: totalAmount,
                currency: "USD",
                paymentMethod: method, // Will now send "BANK_TRANSFER" accurately
                items: formattedItems
            };

            const response = await fetch("http://127.0.0.1:7082/payment/api/payments/initiate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    ...(token && { "Authorization": `Bearer ${token}` })
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Payment initiation failed");
            const data = await response.json();

            // Handle UI transition based on method selected
            if (method === "STRIPE") {
                window.location.href = data.paymentUrl;
            } else if (method === "CRYPTO") {
                setCryptoStep("ADDRESS");
                setIsProcessing(false);
            } else if (method === "BANK_TRANSFER") { // 🎯 Updated to check for BANK_TRANSFER
                setBankStep("DETAILS");
                setIsProcessing(false);
            }

        } catch (error) {
            console.error("Payment Error:", error);
            alert(`Payment failed: ${error.message}`);
            setIsProcessing(false);
        }
    };

    // Helper to reset steps when changing tabs
    const handleTabChange = (method) => {
        setSelectedMethod(method);
        setCryptoStep("SELECT");
        setBankStep("SELECT");
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal Container */}
            <div className={`relative w-full max-w-3xl h-[500px] flex rounded-2xl shadow-2xl overflow-hidden
                ${isDark ? 'bg-[#0d1425] text-white border border-white/10' : 'bg-white text-gray-900'}`}>
                
                {/* Left Sidebar - Payment Options */}
                <div className={`w-1/3 p-6 flex flex-col border-r 
                    ${isDark ? 'bg-[#0a0f1d] border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                    
                    <div className="mb-8">
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-3">Merchant</p>
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl shadow-sm
                                ${isDark ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-600'}`}>
                                M
                            </div>
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <h3 className="font-black tracking-tight text-base leading-none">MICROMART</h3>
                                    <ShieldCheck size={14} className="text-emerald-500" />
                                </div>
                                <p className="text-[9px] font-bold uppercase tracking-widest mt-1 text-emerald-500">
                                    Verified Secure
                                </p>
                            </div>
                        </div>
                    </div>

                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-3">Select Method</p>
                    
                    <div className="space-y-2">
                        <button 
                            onClick={() => handleTabChange("STRIPE")}
                            className={`w-full flex items-center gap-3 p-4 rounded-xl text-sm font-bold transition-all
                                ${selectedMethod === "STRIPE" 
                                    ? (isDark ? 'bg-white/10 text-cyan-400 ring-1 ring-cyan-400/50' : 'bg-cyan-50 text-cyan-600 ring-1 ring-cyan-200') 
                                    : 'opacity-60 hover:opacity-100'}`}
                        >
                            <CreditCard size={18} /> Card
                        </button>

                        <button 
                            onClick={() => handleTabChange("CRYPTO")}
                            className={`w-full flex items-center gap-3 p-4 rounded-xl text-sm font-bold transition-all
                                ${selectedMethod === "CRYPTO" 
                                    ? (isDark ? 'bg-white/10 text-cyan-400 ring-1 ring-cyan-400/50' : 'bg-cyan-50 text-cyan-600 ring-1 ring-cyan-200') 
                                    : 'opacity-60 hover:opacity-100'}`}
                        >
                            <Bitcoin size={18} /> Crypto
                        </button>

                        {/* Updated onClick and active state check to BANK_TRANSFER */}
                        <button 
                            onClick={() => handleTabChange("BANK_TRANSFER")}
                            className={`w-full flex items-center gap-3 p-4 rounded-xl text-sm font-bold transition-all
                                ${selectedMethod === "BANK_TRANSFER" 
                                    ? (isDark ? 'bg-white/10 text-cyan-400 ring-1 ring-cyan-400/50' : 'bg-cyan-50 text-cyan-600 ring-1 ring-cyan-200') 
                                    : 'opacity-60 hover:opacity-100'}`}
                        >
                            <Building2 size={18} /> Bank Transfer
                        </button>
                    </div>
                </div>

                {/* Right Content Area */}
                <div className="w-2/3 p-8 relative flex flex-col">
                    <button onClick={onClose} className="absolute top-6 right-6 opacity-50 hover:opacity-100">
                        <X size={20} />
                    </button>

                    <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
                        
                        {/* --- STRIPE VIEW --- */}
                        {selectedMethod === "STRIPE" && (
                            <div className="text-center space-y-6">
                                <div>
                                    <p className="text-sm opacity-60 mb-2">Total to Pay</p>
                                    <h2 className="text-4xl font-black">${totalAmount.toFixed(2)}</h2>
                                </div>
                                <p className="text-sm opacity-60">You will be redirected to Stripe to securely complete your card payment.</p>
                                <button 
                                    onClick={() => initiatePayment("STRIPE")}
                                    disabled={isProcessing}
                                    className="w-full py-4 rounded-xl bg-cyan-500 text-white font-bold tracking-widest hover:bg-cyan-600 disabled:opacity-50 flex justify-center items-center gap-2"
                                >
                                    {isProcessing ? <Loader2 className="animate-spin" size={18} /> : 'PROCEED TO STRIPE'}
                                </button>
                            </div>
                        )}

                        {/* --- CRYPTO VIEW --- */}
                        {selectedMethod === "CRYPTO" && (
                            <div className="w-full">
                                {cryptoStep === "SELECT" ? (
                                    <div className="text-center space-y-6">
                                        <div>
                                            <p className="text-sm opacity-60 mb-2">Total to Pay</p>
                                            <h2 className="text-4xl font-black">${totalAmount.toFixed(2)}</h2>
                                            <p className="text-xs text-cyan-500 mt-2">≈ {(totalAmount / 65000).toFixed(4)} BTC / USDT</p>
                                        </div>
                                        <p className="text-sm opacity-60">Pay securely via cryptocurrency. We support BTC, ETH, and USDT (TRC20).</p>
                                        <button 
                                            onClick={() => initiatePayment("CRYPTO")}
                                            disabled={isProcessing}
                                            className="w-full py-4 rounded-xl bg-cyan-500 text-white font-bold tracking-widest hover:bg-cyan-600 disabled:opacity-50 flex justify-center items-center gap-2"
                                        >
                                            {isProcessing ? <Loader2 className="animate-spin" size={18} /> : 'GENERATE WALLET ADDRESS'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center space-y-5 animate-in fade-in zoom-in duration-300">
                                        <h3 className="font-bold text-lg">Send Payment</h3>
                                        
                                        <div className="bg-white p-4 rounded-xl inline-block shadow-sm">
                                            <img 
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${mockWalletAddress}`} 
                                                alt="Wallet QR Code" 
                                                className="w-32 h-32"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-xs opacity-60 uppercase tracking-widest">USDT (TRC20) Address</p>
                                            <div className={`flex items-center justify-between p-3 rounded-lg border
                                                ${isDark ? 'bg-black/20 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                                <span className="font-mono text-xs truncate max-w-[200px]">{mockWalletAddress}</span>
                                                <button onClick={() => handleCopy(mockWalletAddress)} className="text-cyan-500 hover:text-cyan-400">
                                                    {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center gap-2 text-xs opacity-60 mt-4">
                                            <Loader2 size={14} className="animate-spin" />
                                            Awaiting network confirmation...
                                        </div>
                                        
                                        <button onClick={() => window.location.href = `/payment/success?orderId=PENDING-CRYPTO`} className="text-[10px] text-cyan-500 underline mt-4 hover:text-cyan-400">
                                            [Dev] Simulate Payment Success
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ---  NEW: BANK TRANSFER VIEW --- */}
                        {/* Updated to check for BANK_TRANSFER */}
                        {selectedMethod === "BANK_TRANSFER" && (
                            <div className="w-full">
                                {bankStep === "SELECT" ? (
                                    <div className="text-center space-y-6">
                                        <div>
                                            <p className="text-sm opacity-60 mb-2">Total to Pay</p>
                                            <h2 className="text-4xl font-black">${totalAmount.toFixed(2)}</h2>
                                        </div>
                                        <p className="text-sm opacity-60">Pay directly into our secure corporate account. Your order will be processed once the funds reflect.</p>
                                        <button 
                                            onClick={() => initiatePayment("BANK_TRANSFER")} // 🎯 Updated payload value
                                            disabled={isProcessing}
                                            className="w-full py-4 rounded-xl bg-cyan-500 text-white font-bold tracking-widest hover:bg-cyan-600 disabled:opacity-50 flex justify-center items-center gap-2"
                                        >
                                            {isProcessing ? <Loader2 className="animate-spin" size={18} /> : 'VIEW ACCOUNT DETAILS'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center space-y-5 animate-in fade-in zoom-in duration-300">
                                        <h3 className="font-bold text-lg">Bank Transfer Details</h3>
                                        
                                        <div className={`p-6 rounded-2xl border text-left space-y-5
                                            ${isDark ? 'bg-black/20 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                            
                                            <div>
                                                <p className="text-[10px] opacity-60 uppercase tracking-widest mb-1">Bank Name</p>
                                                <p className="font-bold text-sm">{mockBankDetails.bankName}</p>
                                            </div>
                                            
                                            <div>
                                                <p className="text-[10px] opacity-60 uppercase tracking-widest mb-1">Account Name</p>
                                                <p className="font-bold text-sm">{mockBankDetails.accountName}</p>
                                            </div>

                                            <div>
                                                <p className="text-[10px] opacity-60 uppercase tracking-widest mb-2">Account Number</p>
                                                <div className="flex items-center justify-between">
                                                    <span className="font-mono text-2xl tracking-[0.2em] font-black text-cyan-500">
                                                        {mockBankDetails.accountNumber}
                                                    </span>
                                                    <button 
                                                        onClick={() => handleCopy(mockBankDetails.accountNumber)} 
                                                        className={`p-3 rounded-xl transition-colors
                                                            ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-200 hover:bg-gray-300'}`}
                                                    >
                                                        {copied ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Copy size={18} />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center gap-2 text-xs opacity-60 mt-4">
                                            <Loader2 size={14} className="animate-spin" />
                                            Awaiting transfer confirmation...
                                        </div>
                                        
                                        <button onClick={() => window.location.href = `/payment/success?orderId=PENDING-BANK`} className="text-[10px] text-cyan-500 underline mt-4 hover:text-cyan-400">
                                            [Dev] Simulate Payment Success
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>

                    <div className="absolute bottom-6 left-0 right-0 text-center">
                        <p className="text-[9px] opacity-40 uppercase tracking-widest flex items-center justify-center gap-2">
                            Secured by MicroMart Vault <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;