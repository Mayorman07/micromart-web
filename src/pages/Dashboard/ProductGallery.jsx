import { useState, useEffect, useMemo } from "react";
import { useOutletContext, useNavigate, useSearchParams } from "react-router-dom";
import api from "../../services/api";
import { useTheme } from "../../contexts/ThemeContext";
import { useToast } from "../../contexts/ToastContext";
import { SearchX, Loader2, XCircle } from "lucide-react"; 

const ProductGallery = () => {
    // Component State
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null); 
    const [sortBy, setSortBy] = useState("featured");
    
    // Hooks & Contexts
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [searchParams] = useSearchParams();
    
    const context = useOutletContext() || {};
    const { searchTerm, fetchCart, isAuthenticated } = context;
    const categoryFilter = searchParams.get("category");

    // Fetch Initial Data
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
                    const prodData = prodRes.data?.content || prodRes.data || [];
                    const catData = catRes.data || [];
                    setProducts(Array.isArray(prodData) ? prodData : []);
                    setCategories(Array.isArray(catData) ? catData : []);
                }
            } catch (err) {
                if (isMounted) showToast("Sync Error: Backend Unreachable", "error");
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        
        loadRegistryData();
        return () => { isMounted = false; };
    }, [showToast]);

    // Cart Interactions
    const handleQuickAdd = async (e, product) => {
        e.stopPropagation(); 
        if (!isAuthenticated) return navigate("/login");

        setProcessingId(product.skuCode);
        try {
            await api.post("/cart/api/cart/items", {
                skuCode: product.skuCode,
                quantity: 1
            });
            
            if (fetchCart) await fetchCart();
            showToast(`${product.name} added to cart`, "success");
        } catch (err) {
            showToast("Update Failed", "error");
        } finally {
            setProcessingId(null);
        }
    };

    // Filtered & Sorted Product List
    const filteredProducts = useMemo(() => {
        const activeCategory = categories.find(c => String(c.id) === String(categoryFilter));
        const targetName = activeCategory?.name?.toLowerCase().trim();

        return products.filter(p => {
            const matchesSearch = !searchTerm || 
                p.name?.toLowerCase().includes(searchTerm.toLowerCase());
            
            let matchesCategory = true;
            if (categoryFilter && targetName) {
                const productCategoryName = p.category?.toLowerCase()?.trim() || "";
                matchesCategory = productCategoryName === targetName || productCategoryName.includes(targetName);
            }

            return matchesSearch && matchesCategory;
        }).sort((a, b) => {
            if (sortBy === "price-low") return a.price - b.price;
            if (sortBy === "price-high") return b.price - a.price;
            return 0;
        });
    }, [products, searchTerm, categoryFilter, categories, sortBy]);

    if (loading) return (
        <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#050505]' : 'bg-white'}`}>
            <Loader2 className="animate-spin text-cyan-500" size={32} />
        </div>
    );

    return (
        <div className={`min-h-screen pt-32 pb-20 px-8 md:px-16 transition-all duration-700 ${isDark ? 'bg-[#050505] text-white' : 'bg-white text-gray-900'}`}>
            
            <header className="max-w-[1600px] mx-auto mb-16">
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-[10px] font-bold tracking-[0.4em] text-cyan-500 uppercase">
                        {categoryFilter ? `Sector / ${categories.find(c => String(c.id) === String(categoryFilter))?.name}` : "Global Registry"}
                    </span>
                    <div className="h-[1px] flex-grow bg-current opacity-10"></div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-current/10 pb-10">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-6xl font-black uppercase tracking-tight italic leading-[0.9]">
                            {categoryFilter ? categories.find(c => String(c.id) === String(categoryFilter))?.name : "Marketplace"}
                        </h2>
                        <p className="text-[11px] font-medium tracking-widest uppercase opacity-40">
                            {filteredProducts.length} Assets Identified
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-8">
                        {categoryFilter && (
                            <button onClick={() => navigate("/")} className="text-[10px] font-bold uppercase text-cyan-500 hover:opacity-70 flex items-center gap-2">
                                <XCircle size={14} /> Reset
                            </button>
                        )}
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)} 
                            className="bg-transparent text-[11px] font-bold uppercase tracking-widest outline-none border-b border-transparent hover:border-cyan-500 transition-all cursor-pointer pb-1"
                        >
                            <option value="featured">Sort / Featured</option>
                            <option value="price-low">Sort / Price Low</option>
                            <option value="price-high">Sort / Price High</option>
                        </select>
                    </div>
                </div>
            </header>

            <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20">
                {filteredProducts.map((product) => {
                    // Logic to check if the product is unavailable
                    const isOutOfStock = product.quantity === 0;

                    return (
                        <div 
                            key={product.skuCode} 
                            className={`group flex flex-col ${isOutOfStock ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`} 
                            onClick={() => !isOutOfStock && navigate(`/product/${product.skuCode}`)}
                        >
                            <div className="aspect-[4/5] overflow-hidden rounded-3xl relative bg-[#f7f7f7] dark:bg-[#0a0a0a] border border-current/5 transition-all duration-500 group-hover:rounded-none group-hover:shadow-2xl">
                                <img 
                                    src={product.imageUrl || 'https://placehold.co/400x500'} 
                                    className={`w-full h-full object-cover transition-transform duration-[1s] group-hover:scale-105 ${isOutOfStock ? 'grayscale brightness-50' : ''}`} 
                                    alt={product.name}
                                />
                                
                                {isOutOfStock && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-black/60 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full">
                                            <span className="text-white text-[10px] font-black tracking-[0.3em] uppercase">Sold Out</span>
                                        </div>
                                    </div>
                                )}

                                <div className="absolute top-6 right-6 bg-white/90 dark:bg-black/80 backdrop-blur-md text-black dark:text-cyan-400 px-4 py-2 rounded-xl text-[11px] font-black border border-current/10 shadow-lg">
                                    ${product.price}
                                </div>

                                <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/60 to-transparent">
                                    <button 
                                        onClick={(e) => handleQuickAdd(e, product)}
                                        disabled={processingId === product.skuCode || isOutOfStock}
                                        className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all ${
                                            isOutOfStock 
                                            ? 'bg-gray-900 text-gray-600 border border-white/5' 
                                            : 'bg-white text-black hover:bg-cyan-500'
                                        }`}
                                    >
                                        {processingId === product.skuCode ? (
                                            <Loader2 className="animate-spin" size={14} />
                                        ) : isOutOfStock ? (
                                            "Unavailable"
                                        ) : (
                                            "Add to Cart"
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8 flex flex-col gap-1 px-1">
                                <h3 className={`text-xl font-bold uppercase tracking-tight transition-colors ${isOutOfStock ? 'text-gray-600' : 'group-hover:text-cyan-500'}`}>
                                    {product.name}
                                </h3>
                                <div className="flex items-center gap-3 opacity-30 font-bold text-[9px] uppercase tracking-widest">
                                    <span>{product.category || 'Uncategorized'}</span>
                                    <span className="h-[1px] w-4 bg-current"></span>
                                    <span>{product.skuCode}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredProducts.length === 0 && (
                <div className="max-w-xl mx-auto py-40 text-center flex flex-col items-center gap-6">
                    <SearchX size={48} strokeWidth={1} className="opacity-10" />
                    <p className="text-[11px] font-bold uppercase tracking-[0.4em] opacity-30">No assets found in this sector.</p>
                </div>
            )}
        </div>
    );
};

export default ProductGallery;