import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { 
    Package, 
    ArrowRight, 
    Loader2, 
    ChevronLeft, 
    ChevronRight, 
    X, 
    ShieldCheck, 
    RefreshCcw 
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useToast } from "../../contexts/ToastContext";
import api from "../../services/api"; 

/**
 * Orders Component
 * Manages the retrieval and display of historical transaction audit logs.
 * Includes functionality for batch asset re-acquisition and registry synchronization.
 */
const Orders = () => {
    const { isDark } = useTheme();
    const { showToast } = useToast();
    
    /** * Context Extraction
     * Pulls global cart state management functions from UserLayout.
     */
    const { fetchCart, setIsCartOpen } = useOutletContext() || {};

    /** Local State Management */
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const [isRestocking, setIsRestocking] = useState(false);

    /** Lifecycle: Initial Ledger Synchronization */
    useEffect(() => {
        fetchOrders();
    }, [page]);

    /**
     * fetchOrders
     * Retrieves paginated order history for the authenticated user principal.
     */
    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/order/api/orders/my-orders/paginated?page=${page}&size=5`);
            setOrders(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);
        } catch (error) { 
            console.error("Critical: Ledger synchronization failure", error); 
        } finally { 
            setIsLoading(false); 
        }
    };

    /**
     * fetchOrderDetails
     * Retrieves a detailed snapshot of a specific transaction by order number.
     */
    const fetchOrderDetails = async (orderNumber) => {
        setIsDetailLoading(true);
        try {
            const response = await api.get(`/order/api/orders/${orderNumber}`);
            setSelectedOrder(response.data);
        } catch (error) { 
            showToast("SNAPSHOT RETRIEVAL FAILED", "error");
        } finally { 
            setIsDetailLoading(false); 
        }
    };

    /**
     * handleReorder
     * Executes batch synchronization of historical items back to the active cart.
     * Triggers a global cart refresh and opens the cart drawer upon success.
     */
    const handleReorder = async () => {
        if (!selectedOrder?.items?.length) return;
        
        setIsRestocking(true);
        try {
            /** Batch deployment to the Cart Microservice */
            await Promise.all(
                selectedOrder.items.map(item => 
                    api.post("/cart/api/cart/items", {
                        skuCode: item.skuCode,
                        quantity: item.quantity || 1
                    })
                )
            );

            /** Synchronize global cart state */
            if (fetchCart) await fetchCart();
            
            showToast("ORDER ASSETS RE-DEPLOYED TO REGISTRY", "success");
            
            /** Close the snapshot view */
            setSelectedOrder(null); 
            
            /** Trigger immediate visual feedback via Cart Drawer */
            if (setIsCartOpen) {
                setTimeout(() => setIsCartOpen(true), 300);
            }
            
        } catch (err) {
            showToast("RE-DEPLOYMENT FAILURE: INVENTORY CONFLICT", "error");
        } finally {
            setIsRestocking(false);
        }
    };

    /** Utility: Status Aesthetic Mapping */
    const getStatusStyle = (status) => {
        switch (status?.toUpperCase()) {
            case 'PAID':
            case 'COMPLETED': return 'text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/20';
            case 'PLACED':
            case 'PENDING': return 'text-[#f59e0b] bg-[#f59e0b]/10 border border-[#f59e0b]/20';
            case 'CANCELLED': return 'text-[#ef4444] bg-[#ef4444]/10 border border-[#ef4444]/20';
            default: return 'text-[#9ca3af] bg-[#9ca3af]/10 border border-[#9ca3af]/20';
        }
    };

    if (isLoading && orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-center">
                <Loader2 className="animate-spin text-cyan-500 mb-6" size={32} strokeWidth={1.5} />
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">Synchronizing Ledger</p>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#0a0f1d] text-[#e5e7eb]' : 'bg-[#f9fafb] text-[#111827]'}`}>
            <div className="max-w-[1200px] mx-auto px-6 py-12 md:px-16 lg:px-24">
                
                <header className="pt-10 mb-12 pb-8 border-b border-gray-100 dark:border-white/5 flex justify-between items-end">
                    <div>
                        <h2 className="text-4xl font-black tracking-tighter uppercase italic">My Orders</h2>
                        <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mt-2 opacity-50`}>
                            Transaction Audit Logs v4.1
                        </p>
                    </div>
                </header>

                <div className="grid gap-6">
                    {orders.map((order) => (
                        <div 
                            key={order.orderNumber} 
                            onClick={() => fetchOrderDetails(order.orderNumber)}
                            className={`p-7 rounded-2xl border transition-all cursor-pointer group flex flex-wrap justify-between items-center gap-6
                            ${isDark 
                                ? 'bg-[#111827] border-white/5 hover:border-cyan-500/30' 
                                : 'bg-white border-gray-100 shadow-sm hover:border-gray-200'}`}
                        >
                            <div className="flex gap-6 items-center">
                                <div className={`w-14 h-14 ${isDark ? 'bg-white/5 text-white' : 'bg-gray-50 text-gray-700'} rounded-xl flex items-center justify-center border ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                                    <Package size={26} strokeWidth={1.2} />
                                </div>
                                <div>
                                    <h4 className="font-mono font-bold text-sm tracking-tight">{order.orderNumber}</h4>
                                    <p className={`text-[10px] font-bold uppercase mt-1 opacity-50`}>
                                        {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="text-right">
                                    <p className={`text-[9px] font-bold uppercase mb-1 opacity-40`}>Settled Amount</p>
                                    <p className="font-black text-xl tracking-tight">${order.totalAmount.toFixed(2)}</p>
                                </div>
                                <div className={`px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${getStatusStyle(order.orderStatus)}`}>
                                    {order.orderStatus}
                                </div>
                                <ArrowRight size={20} className="opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-8 mt-16">
                        <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="p-4 opacity-50 hover:opacity-100 disabled:opacity-5">
                            <ChevronLeft size={20} />
                        </button>
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] opacity-50">{page + 1} / {totalPages}</span>
                        <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} className="p-4 opacity-50 hover:opacity-100 disabled:opacity-5">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>

            {/* Slide-over Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-end p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
                    <div className={`relative w-full max-w-xl h-full rounded-[2.5rem] shadow-3xl flex flex-col animate-in slide-in-from-right duration-500 
                        ${isDark ? 'bg-[#0a0f1d] border-l border-white/5' : 'bg-white text-gray-900'}`}>
                        
                        <div className={`p-10 border-b ${isDark ? 'border-white/5' : 'border-gray-100'} flex justify-between items-center`}>
                            <h3 className="text-2xl font-black uppercase tracking-tighter italic">Order Snapshot</h3>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 opacity-50 hover:rotate-90 transition-transform"><X size={24}/></button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-10 space-y-12 no-scrollbar">
                            <div className="grid grid-cols-2 gap-6">
                                <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#111827] border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                                    <p className="text-[9px] font-bold opacity-30 uppercase tracking-[0.2em] mb-2">Audit Reference</p>
                                    <p className="font-mono text-xs font-bold">{selectedOrder.orderNumber}</p>
                                </div>
                                <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#111827] border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                                    <p className="text-[9px] font-bold opacity-30 uppercase tracking-[0.2em] mb-2">Network Status</p>
                                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded ${getStatusStyle(selectedOrder.orderStatus)}`}>
                                        {selectedOrder.orderStatus}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-6">Asset Allocation</p>
                                <div className="space-y-4">
                                    {selectedOrder.items?.map((item, idx) => (
                                        <div key={idx} className={`flex items-center gap-6 p-5 rounded-2xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                                            <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/5 bg-black">
                                                <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-black uppercase tracking-tight">{item.productName}</p>
                                                <p className="text-[9px] font-mono opacity-40 mt-1 uppercase">SKU: {item.skuCode}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-black">x{item.quantity}</p>
                                                <p className="text-[10px] text-cyan-500 font-bold mt-1">${(item.unitPrice * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Action Control Panel */}
                        <div className="p-10 bg-cyan-500 text-black rounded-b-[2.5rem]">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] font-bold uppercase opacity-60 mb-1">Total Valuation</p>
                                    <p className="text-5xl font-black tracking-tighter italic">${selectedOrder.totalAmount.toFixed(2)}</p>
                                </div>
                                
                                <button 
                                    onClick={handleReorder}
                                    disabled={isRestocking}
                                    className="px-8 py-4 bg-black text-white rounded-2xl flex items-center gap-3 transition-all active:scale-95 disabled:opacity-50 group"
                                >
                                    {isRestocking ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>
                                            <span className="text-[10px] font-black uppercase tracking-widest">Repeat Order</span>
                                            <RefreshCcw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;