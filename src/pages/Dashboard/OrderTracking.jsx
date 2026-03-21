import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from "../../services/api"; 
import { useToast } from '../../contexts/ToastContext';
import LiquidBackgroundDeep from '../../components/LiquidBackgroundDeep';

const OrderTracking = () => {
    const { orderId } = useParams();
    const { showToast } = useToast();
    
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const fetchTrackingDetails = async () => {
            try {
                const response = await api.get(`order/api/orders/${orderId}`);
                setOrder(response.data);
            } catch (error) {
                console.error("Tracking fetch failed:", error);
                showToast("Unable to retrieve tracking details", "error");
            } finally {
                setLoading(false);
            }
        };

        if (orderId) fetchTrackingDetails();
    }, [orderId, showToast]);

    // Define the "Boutique" status levels
    const statusMap = {
        'PENDING': 1,
        'PAID': 2,
        'SHIPPED': 3,
        'DELIVERED': 4
    };

    const currentLevel = statusMap[order?.orderStatus] || 1;

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-cyan-400 tracking-[0.5em] animate-pulse text-xs uppercase">
                    Locating Shipment...
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
                <h2 className="text-2xl font-light mb-4">Order Not Found</h2>
                <Link to="/" className="text-cyan-400 hover:underline text-sm tracking-widest">RETURN TO MARKETPLACE</Link>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-black text-white selection:bg-cyan-500/30">
            <LiquidBackgroundDeep />

            <div className="relative z-10 max-w-4xl mx-auto pt-32 px-6 pb-20">
                {/* HEADER */}
                <header className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <p className="text-cyan-400 text-[10px] tracking-[0.4em] uppercase mb-2">Logistics Portal</p>
                        <h1 className="text-5xl font-extralight tracking-tighter">TRACKING</h1>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-500 text-xs uppercase tracking-widest">Reference</p>
                        <p className="text-xl font-mono text-white">{orderId}</p>
                    </div>
                </header>

                {/* TRACKING VISUALIZER */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-xl mb-12">
                    <div className="flex justify-between items-center relative mb-12">
                        {/* Background Progress Line */}
                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -translate-y-1/2"></div>
                        
                        {/* Active Progress Line */}
                        <div 
                            className="absolute top-1/2 left-0 h-[2px] bg-cyan-500 transition-all duration-1000 ease-out -translate-y-1/2 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                            style={{ width: `${((currentLevel - 1) / 3) * 100}%` }}
                        ></div>

                        {/* Status Nodes */}
                        {Object.keys(statusMap).map((step, idx) => {
                            const stepLevel = idx + 1;
                            const isActive = stepLevel <= currentLevel;
                            return (
                                <div key={step} className="relative z-20 flex flex-col items-center">
                                    <div className={`w-3 h-3 rounded-full transition-all duration-700 ${
                                        isActive ? 'bg-cyan-400 scale-125 shadow-[0_0_20px_rgba(34,211,238,0.8)]' : 'bg-white/20'
                                    }`}></div>
                                    <span className={`absolute -bottom-8 text-[10px] tracking-widest whitespace-nowrap transition-colors duration-500 ${
                                        isActive ? 'text-white font-medium' : 'text-gray-600'
                                    }`}>
                                        {step}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ITEM SUMMARY SECTION */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 border border-white/5 rounded-2xl bg-white/[0.02]">
                        <h3 className="text-xs text-gray-500 tracking-[0.3em] uppercase mb-6">Shipment Contents</h3>
                        <div className="space-y-4">
                            {order.items?.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-300 font-light">{item.quantity}x {item.productName}</span>
                                    <span className="text-gray-500 text-xs">${item.unitPrice}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-8 border border-white/5 rounded-2xl bg-white/[0.02] flex flex-col justify-between">
                        <div>
                            <h3 className="text-xs text-gray-500 tracking-[0.3em] uppercase mb-2">Delivery To</h3>
                            <p className="text-gray-300 font-light">{order.userEmail}</p>
                        </div>
                        <div className="mt-8">
                            <h3 className="text-xs text-gray-500 tracking-[0.3em] uppercase mb-2">Total Value</h3>
                            <p className="text-2xl font-extralight text-cyan-400">${order.totalAmount}</p>
                        </div>
                    </div>
                </div>

                <footer className="mt-16 text-center">
                    <button 
                        onClick={() => window.print()}
                        className="text-[10px] tracking-[0.3em] text-gray-600 hover:text-white transition-colors uppercase"
                    >
                        Download Digital Invoice
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default OrderTracking;