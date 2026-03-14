import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import api from "../../services/api";
import { useTheme } from "../../contexts/ThemeContext";
import { useToast } from "../../contexts/ToastContext";
import { Timer, Zap, ArrowRight, Loader2, ShoppingBag } from "lucide-react";

const Offers = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { fetchCart, isAuthenticated } = useOutletContext() || {};

    useEffect(() => {
        let isMounted = true;
        const loadRegistryData = async () => {
            setLoading(true);
            try {
                const res = await api.get("/inventory/api/inventory/all");
                if (isMounted) {
                    const prodData = res.data?.content || res.data || [];
                    // Artificially sort to put the most expensive items first for the "sale"
                    setProducts(Array.isArray(prodData) ? prodData.sort((a,b) => b.price - a.price) : []);
                }
            } catch (err) {
                if (isMounted) showToast("Sync Error: Offers Unavailable", "error");
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        loadRegistryData();
        return () => { isMounted = false; };
    }, [showToast]);

    const handleQuickAdd = async (skuCode, name) => {
        if (!isAuthenticated) return navigate("/login");
        setProcessingId(skuCode);
        try {
            await api.post("/cart/api/cart/items", { skuCode, quantity: 1 });
            if (fetchCart) await fetchCart();
            showToast(`${name} secured at promotional rate`, "success");
        } catch (err) {
            showToast("Promotional sync failed", "error");
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) return (
        <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#050505]' : 'bg-white'}`}>
            <Loader2 className="animate-spin text-cyan-500" size={32} />
        </div>
    );

    // Grab the most expensive item as the "Hero" offer
    const heroItem = products[0];
    const otherOffers = products.slice(1);

    return (
        <div className={`min-h-screen pt-32 pb-20 px-8 md:px-16 transition-all duration-700 ${isDark ? 'bg-[#050505] text-white' : 'bg-white text-gray-900'}`}>
            
            {/* OFFERS HEADER */}
            <header className="max-w-[1600px] mx-auto mb-16 text-center flex flex-col items-center">
                <div className="flex items-center gap-2 mb-4 text-cyan-500 bg-cyan-500/10 px-4 py-1.5 rounded-full">
                    <Zap size={14} className="fill-cyan-500" />
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase">Active Promotions</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic">
                    Flash Clearance
                </h1>
                <p className="mt-4 text-xs font-medium tracking-widest uppercase opacity-40 max-w-lg">
                    High-value assets released at reduced registry pricing. Inventory is strictly limited.
                </p>
            </header>

            {/* HERO OFFER (The Big Deal) */}
            {heroItem && (
                <div className="max-w-[1600px] mx-auto mb-24 relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-transparent blur-3xl rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    
                    <div className="relative flex flex-col md:flex-row items-center bg-[#f7f7f7] dark:bg-[#0a0a0a] rounded-[3rem] overflow-hidden border border-current/5">
                        <div className="w-full md:w-1/2 p-12 md:p-20 flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-6 text-red-500">
                                <Timer size={16} />
                                <span className="text-[10px] font-black tracking-widest uppercase animate-pulse">Ends in 04:12:59</span>
                            </div>
                            
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
                                {heroItem.name}
                            </h2>
                            <p className="text-sm opacity-50 mb-8 max-w-md">
                                {heroItem.category || "Premium Asset"} — Secure this top-tier acquisition before the clearance window closes.
                            </p>
                            
                            <div className="flex items-end gap-4 mb-10">
                                <span className="text-5xl font-black text-cyan-500">${(heroItem.price * 0.8).toFixed(2)}</span>
                                <span className="text-xl font-bold opacity-30 line-through mb-1">${heroItem.price}</span>
                            </div>
                            
                            <button 
                                onClick={() => handleQuickAdd(heroItem.skuCode, heroItem.name)}
                                disabled={processingId === heroItem.skuCode}
                                className="bg-cyan-500 text-black px-8 py-5 rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-white transition-colors flex items-center justify-center gap-3 w-fit"
                            >
                                {processingId === heroItem.skuCode ? <Loader2 className="animate-spin" size={16} /> : "Claim Promotion"}
                            </button>
                        </div>
                        
                        <div className="w-full md:w-1/2 h-[400px] md:h-[600px] relative overflow-hidden">
                            <img 
                                src={heroItem.imageUrl} 
                                alt={heroItem.name}
                                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                            />
                            <div className="absolute top-6 right-6 bg-red-500 text-white px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider shadow-2xl">
                                20% Off
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* SECONDARY OFFERS */}
            <div className="max-w-[1600px] mx-auto">
                <div className="flex items-center gap-4 mb-10 border-b border-current/10 pb-4">
                    <h3 className="text-xl font-black uppercase tracking-tight">Additional Markdowns</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {otherOffers.map((product) => (
                        <div key={product.skuCode} className="group relative flex flex-col bg-[#f7f7f7] dark:bg-[#0a0a0a] rounded-3xl p-4 border border-current/5 hover:border-cyan-500/30 transition-all">
                            <div className="aspect-square overflow-hidden rounded-2xl relative mb-4">
                                <img 
                                    src={product.imageUrl} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                    alt={product.name}
                                />
                                <div className="absolute top-3 left-3 bg-black/80 text-white px-3 py-1.5 rounded-lg text-[9px] font-black tracking-widest border border-white/10">
                                    -10%
                                </div>
                            </div>
                            
                            <h4 className="font-bold uppercase tracking-tight text-sm mb-1 truncate">{product.name}</h4>
                            <div className="flex justify-between items-end mt-auto pt-4">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold opacity-30 line-through">${product.price}</span>
                                    <span className="text-lg font-black text-cyan-500">${(product.price * 0.9).toFixed(2)}</span>
                                </div>
                                <button 
                                    onClick={() => handleQuickAdd(product.skuCode, product.name)}
                                    disabled={processingId === product.skuCode}
                                    className="bg-current text-white dark:text-black p-3 rounded-xl hover:bg-cyan-500 hover:text-black transition-colors"
                                >
                                    {processingId === product.skuCode ? <Loader2 className="animate-spin" size={16} /> : <ShoppingBag size={16} />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Offers;