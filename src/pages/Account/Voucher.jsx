import { useState } from "react";
import { Tag, Ticket, Plus, Copy, CheckCircle2, AlertCircle } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useToast } from "../../contexts/ToastContext";

const Voucher = () => {
    const { isDark } = useTheme();
    const { showToast } = useToast();
    const [voucherCode, setVoucherCode] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Placeholder data for Monday's logic integration
    const [activeVouchers] = useState([
        {
            id: 1,
            code: "LAUNCH2026",
            discount: "20% OFF",
            description: "First Purchase Reward",
            expiry: "Valid until 31 Dec 2026",
            type: "PERCENTAGE"
        },
        {
            id: 2,
            code: "DRONE-SHP",
            discount: "$50.00",
            description: "Hardware Loyalty Credit",
            expiry: "Valid until 15 June 2026",
            type: "FIXED"
        }
    ]);

    const handleClaimVoucher = (e) => {
        e.preventDefault();
        if (!voucherCode) return;
        
        setIsSubmitting(true);
        // This is where your Monday API logic will go
        setTimeout(() => {
            showToast("Voucher logic will be active on Monday", "info");
            setIsSubmitting(false);
            setVoucherCode("");
        }, 800);
    };

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        showToast("Code copied to clipboard", "success");
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-black uppercase tracking-tighter">Voucher Registry</h2>
                <p className="text-xs opacity-50 font-bold uppercase tracking-widest mt-1">Manage & Redeem Assets</p>
            </div>

            {/* Claim Section */}
            <div className={`p-8 rounded-[2rem] border transition-all
                ${isDark ? 'bg-[#111827] border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-sm'}`}>
                <div className="max-w-md">
                    <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Plus size={16} className="text-cyan-500" />
                        Redeem New Asset
                    </h3>
                    <form onSubmit={handleClaimVoucher} className="flex gap-3">
                        <input 
                            type="text" 
                            value={voucherCode}
                            onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                            placeholder="ENTER VOUCHER CODE"
                            className={`flex-1 bg-transparent border rounded-xl px-5 py-4 text-xs font-mono font-bold tracking-widest outline-none transition-all
                                ${isDark ? 'border-white/10 focus:border-cyan-500 text-white' : 'border-gray-200 focus:border-cyan-600'}`}
                        />
                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-8 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all
                                ${isDark ? 'bg-white text-black hover:bg-cyan-500 hover:text-white' : 'bg-cyan-600 text-white hover:bg-cyan-700'}`}
                        >
                            {isSubmitting ? "SYNCING..." : "CLAIM"}
                        </button>
                    </form>
                </div>
            </div>

            {/* Active Vouchers List */}
            <div className="space-y-6">
                <div className="flex justify-between items-center px-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Available Credits</p>
                </div>

                <div className="grid gap-4">
                    {activeVouchers.length > 0 ? activeVouchers.map((v) => (
                        <div key={v.id} 
                            className={`group relative overflow-hidden p-6 rounded-2xl border transition-all
                            ${isDark ? 'bg-[#111827] border-white/5' : 'bg-white border-gray-100'}`}>
                            
                            {/* Decorative background icon */}
                            <Ticket size={120} className="absolute -right-8 -bottom-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity" />

                            <div className="flex flex-wrap justify-between items-center gap-6 relative z-10">
                                <div className="flex gap-6 items-center">
                                    <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-center border
                                        ${isDark ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                                        <Tag size={24} className="text-cyan-500 mb-1" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h4 className="font-black text-xl tracking-tighter">{v.discount}</h4>
                                            <span className="text-[9px] font-black px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 uppercase tracking-widest border border-emerald-500/20">
                                                Active
                                            </span>
                                        </div>
                                        <p className="text-xs font-bold opacity-70 mt-1">{v.description}</p>
                                        <p className="text-[9px] font-mono opacity-40 uppercase tracking-widest mt-2">{v.expiry}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className={`px-6 py-4 rounded-xl font-mono text-sm font-black tracking-[0.2em] border border-dashed
                                        ${isDark ? 'bg-black/20 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'}`}>
                                        {v.code}
                                    </div>
                                    <button 
                                        onClick={() => copyToClipboard(v.code)}
                                        className={`p-4 rounded-xl transition-all ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                                    >
                                        <Copy size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[2rem] opacity-20">
                            <Ticket size={48} className="mx-auto mb-4" />
                            <p className="text-xs font-bold uppercase tracking-widest">No active vouchers in registry</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Support Note */}
            <div className={`p-6 rounded-2xl border flex items-start gap-4
                ${isDark ? 'bg-cyan-500/5 border-cyan-500/10' : 'bg-cyan-50 border-cyan-100'}`}>
                <AlertCircle size={20} className="text-cyan-500 shrink-0 mt-0.5" />
                <p className={`text-[11px] leading-relaxed font-medium ${isDark ? 'text-cyan-200/60' : 'text-cyan-700/80'}`}>
                    Vouchers are one-time use assets and cannot be combined with other promotional credits unless explicitly stated in the registry terms.
                </p>
            </div>
        </div>
    );
};

export default Voucher;