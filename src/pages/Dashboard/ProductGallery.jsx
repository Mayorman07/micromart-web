import { useState, useEffect, useMemo } from "react";
import { useOutletContext, useNavigate, useSearchParams } from "react-router-dom";
import api from "../../services/api";
import { useTheme } from "../../contexts/ThemeContext";
import { useToast } from "../../contexts/ToastContext";
import { SearchX, Loader2, ShoppingCart } from "lucide-react"; 

/**
 * ProductGallery Component
 * Primary marketplace interface for asset discovery and acquisition.
 * Implements real-time search synchronization, category-based sector filtering, 
 * and adaptive theme rendering.
 */
const ProductGallery = () => {
    /** State Management */
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null); 
    const [sortBy, setSortBy] = useState("featured");
    
    /** Hooks and Contexts */
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [searchParams, setSearchParams] = useSearchParams();
    
    /** * Contextual Data Retrieval 
     * Pulls global search state and cart actions from the parent Layout context.
     */
    const context = useOutletContext() || {};
    const { searchTerm, setSearchTerm, fetchCart, isAuthenticated } = context;
    
    const activeCategoryId = searchParams.get("category");

    /** * Lifecycle: Initial Registry Data Sync
     * Fetches current inventory and category definitions from the backend.
     */
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
                if (isMounted) showToast("Sync Error: Product registry unreachable", "error");
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        
        loadRegistryData();
        return () => { isMounted = false; };
    }, [showToast]);

    /**
     * Logistics Interaction
     * Synchronizes specific asset SKU to the user's active deployment (cart).
     */
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
            showToast(`${product.name} synchronized to deployment`, "success");
        } catch (err) {
            showToast("Synchronization failed: Asset conflict", "error");
        } finally {
            setProcessingId(null);
        }
    };

    /**
     * Compute Filtered Assets
     * Derived state for performing real-time matching across names, descriptions, 
     * and specific category sectors.
     */
    const filteredProducts = useMemo(() => {
        const activeCategoryObj = categories.find(c => String(c.id) === String(activeCategoryId));
        const targetName = activeCategoryObj?.name?.toLowerCase().trim();
    
        return products.filter(p => {
            /** Logic: Search cross-reference across Name and Description */
            const matchesSearch = !searchTerm || 
                p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.description?.toLowerCase().includes(searchTerm.toLowerCase());
            
            /** Logic: Sector-based category verification */
            let matchesCategory = true;
            if (activeCategoryId && targetName) {
                const prodCatName = (p.categoryName || p.category || "").toLowerCase().trim();
                const prodCatId = String(p.categoryId || p.category?.id || "");
                matchesCategory = (prodCatName === targetName) || (prodCatId === String(activeCategoryId));
            }
    
            return matchesSearch && matchesCategory;
        }).sort((a, b) => {
            if (sortBy === "price-low") return a.price - b.price;
            if (sortBy === "price-high") return b.price - a.price;
            return 0;
        });
    }, [products, searchTerm, activeCategoryId, categories, sortBy]);

    /**
     * Sector Navigation Handler
     * Updates URL parameters to trigger the filtered product memo.
     */
    const handleCategoryClick = (id) => {
        if (!id) {
            searchParams.delete("category");
        } else {
            searchParams.set("category", id);
        }
        setSearchParams(searchParams);
    };

    if (loading) return (
        <div className={`min-h-screen flex flex-col items-center justify-center ${isDark ? 'bg-[#050505]' : 'bg-white'}`}>
            <Loader2 className="animate-spin text-cyan-500 mb-4" size={40} />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">Initializing Marketplace Registry...</p>
        </div>
    );

    return (
        <div className={`min-h-screen pb-20 px-8 md:px-16 transition-all duration-700 ${isDark ? 'bg-[#050505] text-white' : 'bg-white text-gray-900'}`}>
            
            {/* Registry Header 
                z-index is explicitly set to 10 to ensure the absolute-positioned 
                UserNavbar (z-100) and MegaMenu (z-110) render above the gallery title.
            */}
            <header className="max-w-[1600px] mx-auto mb-12 relative z-10">
                <div className="flex items-center gap-3 mb-8">
                    <span className="text-[10px] font-black tracking-[0.4em] text-cyan-500 uppercase">
                        Marketplace Registry 
                    </span>
                    <div className="h-[1px] flex-grow bg-current opacity-10"></div>
                </div>

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-7xl lg:text-8xl font-black uppercase tracking-tighter italic leading-[0.8]">
                            Marketplace
                        </h2>
                        <p className="text-[11px] font-black tracking-[0.2em] uppercase opacity-40 mt-4">
                            {filteredProducts.length} Assets Identified in Local Sector
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)} 
                            className={`bg-transparent text-[10px] font-black uppercase tracking-[0.2em] outline-none border-b py-2 transition-all cursor-pointer ${isDark ? 'border-white/10 hover:border-cyan-500' : 'border-black/10 hover:border-cyan-600'}`}
                        >
                            <option value="featured">Sort / Featured</option>
                            <option value="price-low">Sort / Price Low</option>
                            <option value="price-high">Sort / Price High</option>
                        </select>
                    </div>
                </div>

                {/** Category Sector Navigation */}
                <div className="flex gap-4 mt-16 overflow-x-auto pb-6 no-scrollbar border-b border-current/5">
                    <button
                        onClick={() => handleCategoryClick(null)}
                        className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                            !activeCategoryId 
                            ? 'bg-cyan-500 border-cyan-500 text-black shadow-lg shadow-cyan-500/20' 
                            : 'bg-transparent border-current/10 text-slate-500 hover:text-cyan-500'
                        }`}
                    >
                        All Assets
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.id)}
                            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                                String(activeCategoryId) === String(cat.id)
                                ? 'bg-cyan-500 border-cyan-500 text-black shadow-lg shadow-cyan-500/20' 
                                : 'bg-transparent border-current/10 text-slate-500 hover:text-cyan-500'
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </header>

            {/** Registry Product Grid */}
            <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20 relative z-0">
                {filteredProducts.map((product) => {
                    const isOutOfStock = product.quantity === 0 || product.stockQuantity === 0;

                    return (
                        <div 
                            key={product.skuCode} 
                            className={`group flex flex-col ${isOutOfStock ? 'cursor-not-allowed' : 'cursor-pointer'}`} 
                            onClick={() => !isOutOfStock && navigate(`/product/${product.skuCode}`)}
                        >
                            <div className="aspect-[4/5] overflow-hidden rounded-[2.5rem] relative bg-[#f7f7f7] dark:bg-[#0a0a0a] border border-current/5 transition-all duration-700 group-hover:rounded-none group-hover:shadow-3xl">
                                <img 
                                    src={product.imageUrl || 'https://placehold.co/400x500'} 
                                    className={`w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110 ${isOutOfStock ? 'grayscale opacity-40' : ''}`} 
                                    alt={product.name}
                                />
                                
                                {isOutOfStock && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-black/80 backdrop-blur-md px-8 py-3 rounded-full border border-white/10">
                                            <span className="text-white text-[10px] font-black tracking-[0.4em] uppercase font-sans">Depleted</span>
                                        </div>
                                    </div>
                                )}

                                <div className="absolute top-8 right-8 bg-white/90 dark:bg-black/90 backdrop-blur-md text-black dark:text-cyan-400 px-5 py-2 rounded-2xl text-xs font-black border border-current/5 shadow-2xl">
                                    ${product.price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </div>

                                <div className="absolute inset-x-0 bottom-0 p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/80 to-transparent">
                                    <button 
                                        onClick={(e) => handleQuickAdd(e, product)}
                                        disabled={processingId === product.skuCode || isOutOfStock}
                                        className={`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${
                                            isOutOfStock 
                                            ? 'bg-gray-900 text-gray-700 border border-white/5' 
                                            : 'bg-white text-black hover:bg-cyan-500 active:scale-95'
                                        }`}
                                    >
                                        {processingId === product.skuCode ? (
                                            <Loader2 className="animate-spin" size={16} />
                                        ) : isOutOfStock ? (
                                            "Registry Locked"
                                        ) : (
                                            <>
                                                <ShoppingCart size={16} /> Add to Cart
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8 flex flex-col gap-2 px-2">
                                <h3 className={`text-2xl font-black uppercase italic tracking-tighter leading-none transition-colors duration-300 ${isOutOfStock ? 'text-gray-600' : 'group-hover:text-cyan-500'}`}>
                                    {product.name}
                                </h3>
                                <div className="flex items-center gap-3 opacity-30 font-black text-[9px] uppercase tracking-[0.2em]">
                                    <span>{product.categoryName || product.category || 'Asset'}</span>
                                    <span className="h-[1.5px] w-6 bg-current"></span>
                                    <span>{product.skuCode}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/** Logic: Handling Null Results */}
            {filteredProducts.length === 0 && (
                <div className="max-w-xl mx-auto py-40 text-center flex flex-col items-center gap-8 animate-in fade-in duration-1000">
                    <SearchX size={64} strokeWidth={1} className="opacity-10 text-cyan-500" />
                    <div className="space-y-2">
                        <p className="text-[11px] font-black uppercase tracking-[0.5em] opacity-40">Zero Products Identified</p>
                        <p className="text-slate-500 text-xs">The requested search parameters yielded no results in the current registry.</p>
                    </div>
                    <button 
                        onClick={() => {
                            handleCategoryClick(null);
                            if (setSearchTerm) setSearchTerm(""); 
                        }}
                        className="text-cyan-500 text-[10px] font-black uppercase tracking-widest border-b border-cyan-500/20 hover:border-cyan-500 pb-1"
                    >
                        Reset Registry Filters
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductGallery;