import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from "../../services/api"; 
import { useToast } from '../../contexts/ToastContext';
import LiquidBackgroundDeep from '../../components/LiquidBackgroundDeep';

const Checkout = ({ isRetry = false }) => {
    const { orderId } = useParams();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(isRetry);
    const [recoveredItems, setRecoveredItems] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (isRetry && orderId) {
            handleOrderRecovery();
        }
    }, [isRetry, orderId]);

    const handleOrderRecovery = async () => {
        try {
            const response = await api.get(`order/api/orders/${orderId}`);
            const data = response.data;

            setRecoveredItems(data.items || []);
            setTotal(data.totalAmount || 0);
            
            showToast("Order selection restored successfully", "success");
        } catch (error) {
            console.error("Recovery Error:", error);
            showToast("Session expired or order not found", "error");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="animate-pulse tracking-[0.2em] text-cyan-400">IDENTIFYING SECURE SESSION...</div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-black text-white pt-32 pb-20 px-4 lg:px-20">
            {/* Optional background if you want it themed */}
            <div className="fixed inset-0 opacity-20 pointer-events-none">
                <LiquidBackgroundDeep />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-5xl font-extralight tracking-tighter mb-2">
                        {isRetry ? "COMPLETE PURCHASE" : "CHECKOUT"}
                    </h1>
                    <div className="h-[1px] w-24 bg-cyan-500"></div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* LEFT: FORM DATA */}
                    <div className="lg:col-span-7 space-y-12">
                        <section>
                            <h2 className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-8">Shipping Information</h2>
                            <div className="grid grid-cols-2 gap-6">
                                <input className="bg-transparent border-b border-white/20 py-3 focus:border-cyan-500 outline-none transition-all" placeholder="FIRST NAME" />
                                <input className="bg-transparent border-b border-white/20 py-3 focus:border-cyan-500 outline-none transition-all" placeholder="LAST NAME" />
                                <input className="col-span-2 bg-transparent border-b border-white/20 py-3 focus:border-cyan-500 outline-none transition-all" placeholder="STREET ADDRESS" />
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-8">Payment Method</h2>
                            <div className="p-6 border border-white/10 rounded-2xl bg-white/5 flex items-center justify-between">
                                <span>Credit Card / Stripe</span>
                                <div className="flex gap-2">
                                    <div className="w-8 h-5 bg-white/20 rounded"></div>
                                    <div className="w-8 h-5 bg-white/20 rounded"></div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* RIGHT: SUMMARY */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-32 bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl">
                            <h2 className="text-xl font-light mb-8">Order Summary</h2>
                            
                            {isRetry && (
                                <div className="mb-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
                                    <p className="text-cyan-400 text-[10px] tracking-widest uppercase mb-1">Recovery Mode</p>
                                    <p className="text-sm text-gray-300">Items from order <span className="text-white font-mono">{orderId}</span> have been reloaded.</p>
                                </div>
                            )}

                            <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2">
                                {(isRetry ? recoveredItems : []).map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-sm">
                                        <span className="text-gray-400">{item.quantity}x {item.productName}</span>
                                        <span>${item.unitPrice}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-white/10 pt-6 space-y-2">
                                <div className="flex justify-between text-gray-400 text-sm">
                                    <span>Subtotal</span>
                                    <span>${total}</span>
                                </div>
                                <div className="flex justify-between text-white text-xl mt-4 font-light">
                                    <span>Total</span>
                                    <span>${total}</span>
                                </div>
                            </div>

                            <button className="w-full mt-10 bg-white text-black py-4 rounded-full font-bold tracking-widest hover:bg-cyan-400 transition-all duration-500">
                                PAY NOW
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;