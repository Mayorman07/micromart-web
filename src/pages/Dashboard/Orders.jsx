import { useState, useEffect } from "react";
import { Package, ArrowRight, Loader2, ChevronLeft, ChevronRight, X, Hash, Calendar, ShieldCheck } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const Orders = () => {
    // In an enterprise dark mode, 'isDark' should be the baseline.
    const { isDark } = useTheme();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    
    // State for the expanded details view
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDetailLoading, setIsDetailLoading] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, [page]);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            // NOTE: Replace with your actual authenticated API endpoint
            const response = await fetch(`http://127.0.0.1:7082/order/api/orders/my-orders/paginated?page=${page}&size=5`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setOrders(data.content || []);
                setTotalPages(data.totalPages || 0);
            }
        } catch (error) { 
            console.error("Orders fetch failed:", error); 
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
            console.error("Order details fetch failed:", error); 
        } finally { 
            setIsDetailLoading(false); 
        }
    };

    // enterprise-specific status colors
    const getStatusStyle = (status) => {
        switch (status?.toUpperCase()) {
            case 'PAID':
            case 'COMPLETED': return 'text-[#10b981] bg-[#10b981]/10'; // Emerald Green
            case 'PLACED':
            case 'PENDING': return 'text-[#f59e0b] bg-[#f59e0b]/10'; // Amber Yellow
            case 'CANCELLED': return 'text-[#ef4444] bg-[#ef4444]/10'; // Red
            default: return 'text-[#9ca3af] bg-[#9ca3af]/10'; // Gray
        }
    };

    if (isLoading && orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <Loader2 className="animate-spin text-cyan-500 mb-6" size={32} strokeWidth={1.5} />
                <p className="text-xs font-semibold uppercase tracking-widest text-[#9ca3af]">Synchronizing Registry...</p>
            </div>
        );
    }

    return (
        <div className={`relative min-h-screen ${isDark ? 'bg-[#0a0f1d] text-[#e5e7eb]' : 'bg-[#f9fafb] text-[#111827]'} transition-colors duration-300`}>
            {/* The '// neural link established' header is now removed. */}

            <div className="max-w-[1600px] mx-auto p-8 space-y-10">
                {/* Refined Page Header */}
                <div className="mb-10 pb-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-end">
                    <div>
                        <h2 className={`text-4xl font-extrabold tracking-tighter ${!isDark && 'text-[#111827]'}`}>My Orders</h2>
                        <p className={`text-xs ${isDark ? 'text-[#9ca3af]' : 'text-gray-500'} font-semibold uppercase tracking-widest mt-1`}>Transaction Audit Logs</p>
                    </div>
                    {orders.length > 0 && (
                        <div className={`px-4 py-2 rounded-full text-[10px] font-bold ${isDark ? 'bg-[#111827] text-white' : 'bg-gray-100'}`}>
                            {orders.length} ACTIVE ASSETS
                        </div>
                    )}
                </div>

                {/* Orders List with refined dark cards */}
                <div className="grid gap-6">
                    {orders.map((order) => (
                        <div 
                            key={order.orderNumber} 
                            onClick={() => fetchOrderDetails(order.orderNumber)}
                            className={`p-6 rounded-2xl border transition-all cursor-pointer group
                            ${isDark 
                                ? 'bg-[#111827] border-white/5 hover:border-cyan-500/30' 
                                : 'bg-white border-gray-100 shadow-sm shadow-gray-100/50 hover:border-gray-200'}`}
                        >
                            <div className="flex flex-wrap justify-between items-center gap-6">
                                <div className="flex gap-5 items-center">
                                    {/* Cleaner icon - simple white outline Package */}
                                    <div className={`w-14 h-14 ${isDark ? 'bg-white/5 text-white' : 'bg-gray-50 text-gray-700'} rounded-xl flex items-center justify-center`}>
                                        <Package size={28} strokeWidth={1.2} />
                                    </div>
                                    <div>
                                        <h4 className="font-mono font-bold text-sm tracking-tight">{order.orderNumber}</h4>
                                        <p className={`text-[10px] ${isDark ? 'text-[#9ca3af]' : 'text-gray-500'} uppercase font-semibold mt-0.5`}>
                                            {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className={`text-[10px] ${isDark ? 'text-[#9ca3af]' : 'text-gray-500'} uppercase font-semibold mb-0.5`}>Total Settled</p>
                                        <p className={`font-extrabold text-xl ${!isDark && 'text-[#111827]'}`}>${order.totalAmount.toFixed(2)}</p>
                                    </div>
                                    
                                    {/* Corporate status badges */}
                                    <div className={`px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(order.orderStatus)}`}>
                                        {order.orderStatus}
                                    </div>

                                    <div className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'} opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all`}>
                                        <ArrowRight size={20} className={isDark ? 'text-white' : 'text-gray-900'} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Refined Pagination Controls */}
                <div className={`flex items-center justify-center gap-6 mt-12 py-6 border-t ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                    <button 
                        disabled={page === 0}
                        onClick={() => setPage(p => p - 1)}
                        className={`p-3 rounded-xl transition-colors ${isDark ? 'bg-[#111827] text-white hover:bg-[#1a202c]' : 'bg-gray-100 hover:bg-gray-200'} disabled:opacity-20`}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className={`text-[11px] font-semibold uppercase tracking-widest ${isDark ? 'text-[#9ca3af]' : 'text-gray-600'}`}>
                        Page {page + 1} / {totalPages}
                    </span>
                    <button 
                        disabled={page >= totalPages - 1}
                        onClick={() => setPage(p => p + 1)}
                        className={`p-3 rounded-xl transition-colors ${isDark ? 'bg-[#111827] text-white hover:bg-[#1a202c]' : 'bg-gray-100 hover:bg-gray-200'} disabled:opacity-20`}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* --- ORDER DETAILS OVERLAY --- (Refined dark mode) */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-end p-4 transition-opacity duration-300">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
                    <div className={`relative w-full max-w-xl h-full rounded-3xl shadow-3xl overflow-hidden flex flex-col animate-in slide-in-from-right duration-500 
                        ${isDark ? 'bg-[#0a0f1d] border-l border-white/5 text-[#e5e7eb]' : 'bg-white'}`}>
                        
                        <div className={`p-8 border-b ${isDark ? 'border-white/5' : 'border-gray-100'} flex justify-between items-center`}>
                            <h3 className={`text-2xl font-extrabold uppercase tracking-tighter ${!isDark && 'text-[#111827]'}`}>Order Snapshot</h3>
                            <button onClick={() => setSelectedOrder(null)} className={`p-2.5 ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'} rounded-full`}>
                                <X size={22}/>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-10">
                            {/* refined meta grid */}
                            <div className="grid grid-cols-2 gap-5">
                                <div className={`p-5 rounded-2xl ${isDark ? 'bg-[#111827] border border-white/5' : 'bg-gray-50'}`}>
                                    <p className={`text-[10px] font-bold ${isDark ? 'text-[#9ca3af]' : 'text-gray-500'} uppercase tracking-wider mb-1.5`}>Reference ID</p>
                                    <p className={`font-mono text-xs font-bold ${!isDark && 'text-[#111827]'}`}>{selectedOrder.orderNumber}</p>
                                </div>
                                <div className={`p-5 rounded-2xl ${isDark ? 'bg-[#111827] border border-white/5' : 'bg-gray-50'}`}>
                                    <p className={`text-[10px] font-bold ${isDark ? 'text-[#9ca3af]' : 'text-gray-500'} uppercase tracking-wider mb-1.5`}>Status</p>
                                    <p className={`text-xs font-bold uppercase ${getStatusStyle(selectedOrder.orderStatus)} bg-transparent p-0`}>{selectedOrder.orderStatus}</p>
                                </div>
                            </div>

                            {/* Itemized Line Items */}
                            <div>
                                <p className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${isDark ? 'text-[#9ca3af]' : 'text-gray-500'} mb-5`}>Audit Trail - Line Items</p>
                                <div className="space-y-5">
                                    {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className={`flex items-center gap-5 p-4 rounded-xl ${isDark ? 'bg-[#111827]/50 border border-white/5' : 'bg-gray-50/50'}`}>
                                            <div className="w-16 h-16 rounded-xl bg-white/5 overflow-hidden border border-white/5 flex-shrink-0">
                                                <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <p className={`text-xs font-bold uppercase tracking-tight ${!isDark && 'text-[#111827]'}`}>{item.productName}</p>
                                                <p className={`text-[10px] ${isDark ? 'text-[#9ca3af]' : 'text-gray-500'} font-mono mt-0.5`}>SKU: {item.skuCode}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-sm font-extrabold ${!isDark && 'text-[#111827]'}`}>x{item.quantity}</p>
                                                <p className={`text-[10px] text-cyan-500 font-semibold mt-0.5`}>${(item.unitPrice * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer Summary - Solid cyan block for enterprise brand finish */}
                        <div className="p-8 mt-auto bg-cyan-500 text-white">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] font-bold uppercase opacity-80">Aggregate Value</p>
                                    <p className="text-4xl font-extrabold tracking-tighter">${selectedOrder.totalAmount.toFixed(2)}</p>
                                </div>
                                <ShieldCheck size={44} strokeWidth={1} className="opacity-30" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;