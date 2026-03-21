import { useState, useEffect, useMemo } from "react";
import { useOutletContext, useNavigate, useSearchParams } from "react-router-dom";
import api from "../../services/api";
import { useTheme } from "../../contexts/ThemeContext";
import { useToast } from "../../contexts/ToastContext";
import { SearchX, Loader2, ShoppingCart } from "lucide-react"; 

const ProductGallery = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null); 
    const [sortBy, setSortBy] = useState("featured");
    
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [searchParams, setSearchParams] = useSearchParams();
    
    const { searchTerm, setSearchTerm, fetchCart, isAuthenticated } = useOutletContext() || {};
    const activeCategoryId = searchParams.get("category");

    useEffect(() => {
        let isMounted = true;
        const loadRegistryData = async () => {
            setLoading(true);
            try {
                const [prodRes, catRes] = await Promise.all([
                    api.get("/inventory/api/inventory/all"),
                    api.get("/products/categories/all")
                ]);
                
                if (isMounted) {
                    /** FIX: Explicitly extract 'content' from Spring Page object */
                    const rawData = prodRes.data?.content || prodRes.data || [];
                    setProducts(Array.isArray(rawData) ? rawData : []);
                    setCategories(Array.isArray(catRes.data) ? catRes.data : []);
                }
            } catch (err) {
                if (isMounted) showToast("REGISTRY SYNC ERROR", "error");
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        
        loadRegistryData();
        return () => { isMounted = false; };
    }, [showToast]);

    const handleQuickAdd = async (e, product) => {
        e.stopPropagation(); 
        if (!isAuthenticated) return navigate("/login");

        // FIX: Use the actual skuCode from the synchronized product object
        setProcessingId(product.skuCode);
        try {
            await api.post("/cart/api/cart/items", {
                skuCode: product.skuCode,
                quantity: 1
            });
            
            if (fetchCart) await fetchCart();
            showToast("PRODUCT ADDED TO CART", "success");
        } catch (err) {
            showToast("CONFLICT: KINDLY RETRY", "error");
        } finally {
            setProcessingId(null);
        }
    };

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = !searchTerm || 
                p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.description?.toLowerCase().includes(searchTerm.toLowerCase());
            
            let matchesCategory = true;
            if (activeCategoryId) {
                matchesCategory = String(p.categoryId) === String(activeCategoryId);
            }
            return matchesSearch && matchesCategory;
        }).sort((a, b) => {
            if (sortBy === "price-low") return a.price - b.price;
            if (sortBy === "price-high") return b.price - a.price;
            return 0;
        });
    }, [products, searchTerm, activeCategoryId, sortBy]);

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-cyan-500 mb-4" size={40} />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Decrypting Registry...</p>
        </div>
    );

    return (
        <div className={`min-h-screen pb-20 px-8 md:px-16 transition-all duration-700 ${isDark ? 'bg-[#050505] text-white' : 'bg-white text-gray-900'}`}>
            <header className="max-w-[1600px] mx-auto mb-12 py-10">
                <h2 className="text-7xl lg:text-8xl font-black uppercase tracking-tighter italic leading-none mb-4">
                    Marketplace
                </h2>
                <div className="h-[1px] w-full bg-current opacity-10 mb-8"></div>
                {/* CATEGORY BUTTONS MAPPING... */}
            </header>

            <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20">
                {filteredProducts.map((product) => (
                    <div 
                        key={product.skuCode} 
                        className="group flex flex-col cursor-pointer" 
                        onClick={() => navigate(`/product/${product.skuCode}`)}
                    >
                        <div className="aspect-[4/5] overflow-hidden rounded-[2.5rem] relative bg-[#0a0a0a] border border-white/5 transition-all duration-700 group-hover:rounded-none">
                            <img 
                                src={product.imageUrl || 'https://placehold.co/400x500'} 
                                className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" 
                                alt={product.name}
                            />
                            <div className="absolute top-8 right-8 bg-black/90 backdrop-blur-md text-cyan-400 px-5 py-2 rounded-2xl text-xs font-black border border-white/10 shadow-2xl">
                                ${product.price?.toLocaleString()}
                            </div>
                            <div className="absolute inset-x-0 bottom-0 p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black to-transparent">
                                <button 
                                    onClick={(e) => handleQuickAdd(e, product)}
                                    disabled={processingId === product.skuCode}
                                    className="w-full py-5 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-cyan-500 transition-colors"
                                >
                                    {processingId === product.skuCode ? <Loader2 className="animate-spin" size={16} /> : <><ShoppingCart size={16} /> Add to Cart</>}
                                </button>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col gap-2 px-2">
                            <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none group-hover:text-cyan-500 transition-colors">
                                {product.name}
                            </h3>
                            <p className="opacity-30 font-black text-[9px] uppercase tracking-[0.2em]">
                                {product.categoryName} — {product.skuCode}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductGallery;