import { useState, useEffect } from "react";
import { Package, ArrowRight, Loader2, ChevronLeft, ChevronRight, X, Hash, Calendar, ShieldCheck } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const Orders = () => {
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
            const response = await fetch(`http://127.0.0.1:7082/order/api/orders/my-orders/paginated?page=${page}&size=5`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setOrders(data.content || []);
                setTotalPages(data.totalPages || 0);
            }
        } catch (error) { console.error(error); }
        finally { setIsLoading(false); }
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
        } catch (error) { console.error(error); }
        finally { setIsDetailLoading(false); }
    };

    const getStatusStyle = (status) => {
        switch (status?.toUpperCase()) {
            case 'PAID': return 'text-emerald-500 bg-emerald-500/10';
            case 'PLACED': return 'text-amber-500 bg-amber-500/10';
            case 'CANCELLED': return 'text-red-500 bg-red-500/10';
            default: return 'text-gray-400 bg-gray-400/10';
        }
    };

    return (
        <div className="relative space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-black uppercase tracking-tighter">My Orders</h2>
                <p className="text-xs opacity-50 font-bold uppercase tracking-widest">Transaction History</p>
            </div>

            {/* Orders List */}
            <div className="grid gap-4">
                {orders.map((order) => (
                    <div 
                        key={order.orderNumber} 
                        onClick={() => fetchOrderDetails(order.orderNumber)}
                        className={`p-6 rounded-2xl border transition-all cursor-pointer hover:border-cyan-500/50 group
                        ${isDark ? 'bg-[#0d1425] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
                    >
                        <div className="flex justify-between items-center">
                            <div className="flex gap-4 items-center">
                                <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-500"><Package size={24} /></div>
                                <div>
                                    <h4 className="font-mono font-bold text-sm tracking-tight">{order.orderNumber}</h4>
                                    <p className="text-[10px] opacity-40 uppercase font-black">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="text-[10px] opacity-40 uppercase font-black mb-1">Total</p>
                                    <p className="font-bold text-lg">${order.totalAmount.toFixed(2)}</p>
                                </div>
                                <div className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${getStatusStyle(order.orderStatus)}`}>{order.orderStatus}</div>
                                <ArrowRight size={18} className="opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination controls (as before) */}

            {/* --- ORDER DETAILS OVERLAY --- */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-end p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setSelectedOrder(null)} />
                    <div className={`relative w-full max-w-lg h-full rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-right duration-500 ${isDark ? 'bg-[#0a0f1d] border-l border-white/10' : 'bg-white'}`}>
                        
                        <div className="p-8 border-b border-white/5 flex justify-between items-center">
                            <h3 className="text-xl font-black uppercase tracking-tighter">Order Snapshot</h3>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white/5 rounded-full"><X size={20}/></button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            {/* Status & Meta */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <p className="text-[9px] font-bold opacity-40 uppercase mb-1">ID</p>
                                    <p className="font-mono text-xs font-bold">{selectedOrder.orderNumber}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <p className="text-[9px] font-bold opacity-40 uppercase mb-1">Status</p>
                                    <p className={`text-xs font-bold uppercase ${getStatusStyle(selectedOrder.orderStatus)} bg-transparent p-0`}>{selectedOrder.orderStatus}</p>
                                </div>
                            </div>

                            {/* Items List */}
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 mb-4">Line Items</p>
                                <div className="space-y-4">
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 group">
                                            <div className="w-14 h-14 rounded-lg bg-white/5 overflow-hidden border border-white/5">
                                                <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-bold uppercase tracking-tight">{item.productName}</p>
                                                <p className="text-[10px] opacity-40 font-mono">SKU: {item.skuCode}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-black">x{item.quantity}</p>
                                                <p className="text-[10px] text-cyan-500 font-bold">${(item.unitPrice * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer Summary */}
                        <div className="p-8 bg-cyan-500 text-white">
                            <div className="flex justify-between items-center">
                                <div><p className="text-[10px] font-black uppercase opacity-60">Total Value</p><p className="text-3xl font-black">${selectedOrder.totalAmount.toFixed(2)}</p></div>
                                <ShieldCheck size={40} className="opacity-20" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;