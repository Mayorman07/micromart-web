import { useState, useEffect } from "react";
import api from "../../services/api";
import { useToast } from "../../contexts/ToastContext";
import { Loader2, CheckCircle, Clock, AlertCircle } from "lucide-react";

/**
 * AdminPayments Component
 * Provides an interface for administrators to review and approve manual bank transfers.
 */
const AdminPayments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const { showToast } = useToast();

    // Fetch pending payments on component mount
    useEffect(() => {
        fetchPendingPayments();
    }, []);

    const fetchPendingPayments = async () => {
        setLoading(true);
        try {
            // Assuming your API Gateway routes /payment to the payment microservice
            const response = await api.get("/payment/api/payments/pending");
            setPayments(response.data || []);
        } catch (error) {
            showToast("Failed to fetch pending payments", "error");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handles the manual approval of a payment.
     * @param {string} reference - The external reference of the payment.
     */
    const handleApprove = async (reference) => {
        if (!window.confirm("Confirm receipt of funds and approve this payment?")) return;

        setProcessingId(reference);
        try {
            await api.post(`/payment/api/payments/approve?reference=${reference}`);
            showToast("Payment approved successfully", "success");
            
            // Remove the approved payment from the local state to update the UI
            setPayments(prev => prev.filter(p => p.externalReference !== reference));
        } catch (error) {
            showToast("Failed to approve payment", "error");
            console.error(error);
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center p-10 min-h-[60vh]">
                <Loader2 className="animate-spin text-cyan-500" size={40} />
            </div>
        );
    }

    return (
        <div className="flex-1 p-8 md:p-12 animate-in fade-in duration-500">
            {/* Header Section */}
            <header className="mb-10">
                <h1 className="text-4xl font-black uppercase tracking-tight text-white flex items-center gap-4">
                    Manual Payments
                    <span className="text-xs font-bold bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full border border-cyan-500/20">
                        {payments.length} Pending
                    </span>
                </h1>
                <p className="text-slate-400 text-sm mt-2 tracking-widest uppercase font-medium">
                    Review and authorize wire transfers and offline acquisitions.
                </p>
            </header>

            {/* Data Table Section */}
            <div className="bg-[#121520] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#1a1e2d] border-b border-white/5">
                                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">User ID</th>
                                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {payments.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-500">
                                            <CheckCircle size={48} className="mb-4 opacity-20" />
                                            <p className="text-sm font-bold tracking-widest uppercase">No pending approvals required.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                payments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="p-6">
                                            <span className="text-sm font-black text-white">{payment.orderId}</span>
                                            <div className="text-[10px] text-slate-500 tracking-widest mt-1">REF: {payment.externalReference}</div>
                                        </td>
                                        <td className="p-6 text-sm font-medium text-slate-300">
                                            {payment.userId}
                                        </td>
                                        <td className="p-6">
                                            <span className="text-lg font-black text-cyan-400">
                                                {payment.currency} {payment.amount.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            <span className="inline-flex items-center gap-1.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase">
                                                <Clock size={12} />
                                                {payment.status.replace(/_/g, " ")}
                                            </span>
                                        </td>
                                        <td className="p-6 text-right">
                                            <button
                                                onClick={() => handleApprove(payment.externalReference)}
                                                disabled={processingId === payment.externalReference}
                                                className="bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-2.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all disabled:opacity-50 flex items-center justify-center ml-auto gap-2"
                                            >
                                                {processingId === payment.externalReference ? (
                                                    <Loader2 className="animate-spin" size={14} />
                                                ) : (
                                                    "Approve"
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPayments;