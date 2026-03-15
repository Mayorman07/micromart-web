import { useState, useEffect } from "react";
import { Package, ArrowRight, Loader2, ChevronLeft, ChevronRight, X, ShieldCheck } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

/**
 * Orders Component
 * Enterprise-grade order registry with paginated data fetching
 * and high-contrast professional dark/light modes.
 */
const Orders = () => {
    const { isDark } = useTheme();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDetailLoading, setIsDetailLoading] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, [page]);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://127.0.0.1:7082/order/api/orders/my-orders/paginated?page=${page}&size=5`, {
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (response.ok) {
                const data = await response.json();
                setOrders(data.content || []);
                setTotalPages(data.totalPages || 0);
            }
        } catch (error) { 
            console.error("Critical: Failed to sync order registry", error); 
        } finally { 
            setIsLoading(false); 
        }
    };

    const fetchOrderDetails = async (orderNumber) => {
        setIsDetailLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://127.0.0.1:7082/order/api/orders/${orderNumber}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setSelectedOrder(data);
            }
        } catch (error) { 
            console.error("Order snapshot retrieval failed", error); 
        } finally { 
            setIsDetailLoading(false); 
        }
    };

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
            
            {/* Main Content Area: Padding-left logic added to prevent sidebar collision */}
            <div className="max-w-[1200px] mx-auto px-6 py-12 md:px-16 lg:px-24">
                
                {/* Header Section */}
                <div className="pt-10 mb-12 pb-8 border-b border-gray-100 dark:border-white/5 flex justify-between items-end">
                    <div>
                        <h2 className="text-4xl font-black tracking-tighter uppercase">My Orders</h2>
                        <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mt-2 ${isDark ? 'text-[#9ca3af]' : 'text-gray-500'}`}>
                            Transaction Audit Logs
                        </p>
                    </div>
                    {orders.length > 0 && (
                        <div className={`px-4 py-2 rounded-lg text-[10px] font-black border ${isDark ? 'bg-[#111827] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
                            {orders.length} TOTAL ASSETS
                        </div>
                    )}
                </div>

                {/* Orders List */}
                <div className="grid gap-6">
                    {orders.length > 0 ? orders.map((order) => (
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
                                    <p className={`text-[10px] font-bold uppercase mt-1 ${isDark ? 'text-[#9ca3af]' : 'text-gray-500'}`}>
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

                                <div className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-100'} opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all`}>
                                    <ArrowRight size={20} />
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="py-32 text-center opacity-20">
                            <Package size={64} className="mx-auto mb-4" strokeWidth={1} />
                            <p className="text-xs font-bold uppercase tracking-[0.3em]">No Assets Registered</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-8 mt-16">
                        <button 
                            disabled={page === 0}
                            onClick={() => setPage(p => p - 1)}
                            className={`p-4 rounded-xl transition-all ${isDark ? 'bg-[#111827] border border-white/5 hover:bg-[#1a2233]' : 'bg-white border border-gray-200 hover:bg-gray-50'} disabled:opacity-10`}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] opacity-50">
                            {page + 1} / {totalPages}
                        </span>
                        <button 
                            disabled={page >= totalPages - 1}
                            onClick={() => setPage(p => p + 1)}
                            className={`p-4 rounded-xl transition-all ${isDark ? 'bg-[#111827] border border-white/5 hover:bg-[#1a2233]' : 'bg-white border border-gray-200 hover:bg-gray-50'} disabled:opacity-10`}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>

            {/* --- SLIDE-OVER DETAILS OVERLAY --- */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-end p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
                    <div className={`relative w-full max-w-xl h-full rounded-3xl shadow-3xl flex flex-col animate-in slide-in-from-right duration-500 
                        ${isDark ? 'bg-[#0a0f1d] border-l border-white/5' : 'bg-white'}`}>
                        
                        <div className={`p-10 border-b ${isDark ? 'border-white/5' : 'border-gray-100'} flex justify-between items-center`}>
                            <h3 className="text-2xl font-black uppercase tracking-tighter">Order Snapshot</h3>
                            <button onClick={() => setSelectedOrder(null)} className={`p-3 rounded-full ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}>
                                <X size={24}/>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-10 space-y-12">
                            <div className="grid grid-cols-2 gap-6">
                                <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#111827] border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                                    <p className="text-[9px] font-bold opacity-40 uppercase tracking-widest mb-2">Audit Reference</p>
                                    <p className="font-mono text-xs font-bold">{selectedOrder.orderNumber}</p>
                                </div>
                                <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#111827] border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                                    <p className="text-[9px] font-bold opacity-40 uppercase tracking-widest mb-2">Network Status</p>
                                    <p className={`text-xs font-black uppercase ${getStatusStyle(selectedOrder.orderStatus)} bg-transparent border-none p-0`}>
                                        {selectedOrder.orderStatus}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-6">Asset Allocation</p>
                                <div className="space-y-4">
                                    {selectedOrder.items?.map((item, idx) => (
                                        <div key={idx} className={`flex items-center gap-6 p-5 rounded-2xl border ${isDark ? 'bg-[#111827]/40 border-white/5' : 'bg-gray-50/50 border-gray-100'}`}>
                                            <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/5">
                                                <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-black uppercase">{item.productName}</p>
                                                <p className="text-[10px] font-mono opacity-40 mt-1">SKU: {item.skuCode}</p>
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

                        <div className="p-10 bg-cyan-500 text-white">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] font-bold uppercase opacity-70 mb-1">Total Valuation</p>
                                    <p className="text-4xl font-black tracking-tighter">${selectedOrder.totalAmount.toFixed(2)}</p>
                                </div>
                                <ShieldCheck size={48} strokeWidth={1} className="opacity-30" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;