import { useState, useEffect } from "react";
import { Package, ArrowRight, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const Orders = () => {
    const { isDark } = useTheme();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchOrders();
    }, [page]); // Re-fetch whenever the page changes

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            // Calling your existing endpoint: /api/orders/my-orders/paginated
            const response = await fetch(`http://127.0.0.1:7082/order/api/orders/my-orders/paginated?page=${page}&size=5`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const data = await response.json();
                // Spring Data Page structure mapping:
                setOrders(data.content || []);
                setTotalPages(data.totalPages || 0);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status?.toUpperCase()) {
            case 'PAID':
            case 'COMPLETED': return 'text-emerald-500 bg-emerald-500/10';
            case 'PLACED':
            case 'PENDING': return 'text-amber-500 bg-amber-500/10';
            case 'CANCELLED': return 'text-red-500 bg-red-500/10';
            default: return 'text-gray-400 bg-gray-400/10';
        }
    };

    if (isLoading && orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-cyan-500 mb-4" size={32} />
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Syncing Registry...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter">My Orders</h2>
                    <p className="text-xs opacity-50 font-bold uppercase tracking-widest">Transaction History</p>
                </div>
            </div>

            {orders.length > 0 ? (
                <>
                    <div className="grid gap-4">
                        {orders.map((order) => (
                            <div key={order.orderNumber} 
                                 className={`p-6 rounded-2xl border transition-all hover:border-cyan-500/50 group
                                 ${isDark ? 'bg-[#0d1425] border-white/5' : 'bg-white border-gray-100 shadow-sm shadow-gray-200/50'}`}>
                                
                                <div className="flex flex-wrap justify-between items-center gap-4">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-500">
                                            <Package size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-mono font-bold text-sm tracking-tight">{order.orderNumber}</h4>
                                            <p className="text-[10px] opacity-40 uppercase font-black">
                                                {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-[10px] opacity-40 uppercase font-black mb-1">Settlement</p>
                                            <p className="font-bold text-lg">${order.totalAmount.toFixed(2)}</p>
                                        </div>
                                        
                                        <div className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${getStatusStyle(order.orderStatus)}`}>
                                            {order.orderStatus}
                                        </div>

                                        <button className={`p-3 rounded-xl transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'}`}>
                                            <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <button 
                            disabled={page === 0}
                            onClick={() => setPage(p => p - 1)}
                            className="p-2 rounded-lg bg-white/5 disabled:opacity-20 hover:bg-white/10 transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-50">
                            Page {page + 1} of {totalPages}
                        </span>
                        <button 
                            disabled={page >= totalPages - 1}
                            onClick={() => setPage(p => p + 1)}
                            className="p-2 rounded-lg bg-white/5 disabled:opacity-20 hover:bg-white/10 transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </>
            ) : (
                <div className="text-center py-20 opacity-30">
                    <Package size={48} className="mx-auto mb-4" />
                    <p className="text-xs font-bold uppercase tracking-[0.2em]">No Assets Found</p>
                </div>
            )}
        </div>
    );
};

export default Orders;