import { useState, useEffect, useMemo } from "react";
import { useOutletContext, useNavigate, useSearchParams } from "react-router-dom";
import api from "../../services/api";
import { useTheme } from "../../contexts/ThemeContext";
import { useToast } from "../../contexts/ToastContext";
import { SearchX, Loader2, XCircle, ChevronDown, Eye, X, Cpu, ShieldCheck } from "lucide-react"; 

const ProductGallery = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null); 
    const [sortBy, setSortBy] = useState("featured");
    const [selectedProduct, setSelectedProduct] = useState(null);
    
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [searchParams, setSearchParams] = useSearchParams();
    
    const { setIsCartOpen, searchTerm, fetchCart, isAuthenticated } = useOutletContext();
    const categoryFilter = searchParams.get("category");

    useEffect(() => {
        const loadRegistryData = async () => {
            setLoading(true);
            try {
                const [prodRes, catRes] = await Promise.all([
                    api.get("/inventory/api/inventory/all"),
                    api.get("/products/categories/all")
                ]);
                setProducts(prodRes.data.content || []);
                setCategories(catRes.data || []);
            } catch (err) {
                console.error("Registry sync error", err);
                showToast("Failed to synchronize with central registry.", "error");
            } finally {
                setLoading(false);
            }
        };
        loadRegistryData();
    }, [showToast]);

    const filteredProducts = useMemo(() => {
        let items = products.filter(p => {
            // Text Search Logic
            const matchesSearch = !searchTerm || 
                p.name?.toLowerCase().includes(searchTerm.toLowerCase());
            
            // Nested Entity Logic (Matches product.category.id from your Java Entity)
            const pCatId = p.category?.id || p.category_id || p.categoryId;
            const matchesCategory = !categoryFilter || 
                String(pCatId) === String(categoryFilter);

            return matchesSearch && matchesCategory;
        });

        // Precision Sorting
        if (sortBy === "price-low") items.sort((a, b) => a.price - b.price);
        if (sortBy === "price-high") items.sort((a, b) => b.price - a.price);
        if (sortBy === "alpha") items.sort((a, b) => a.name.localeCompare(b.name));
        
        return items;
    }, [products, searchTerm, categoryFilter, sortBy]);

    const activeCategoryName = useMemo(() => {
        return categories.find(c => String(c.id) === String(categoryFilter))?.name || "Marketplace";
    }, [categories, categoryFilter]);

    const handleAddToCart = async (product) => {
        if (!isAuthenticated) {
            showToast("Secure session required for acquisition.", "info");
            navigate("/login");
            return;
        }

        setProcessingId(product.skuCode); 
        try {
            await api.post("/cart/api/cart/items", { skuCode: product.skuCode, quantity: 1 });
            await fetchCart();
            setIsCartOpen(true);
            setSelectedProduct(null);
            showToast(`${product.name} registered.`, "success");
        } catch (err) {
            showToast("Acquisition protocol error.", "error");
        } finally {
            setProcessingId(null); 
        }
    };

    if (loading) return (
        <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-black' : 'bg-white'}`}>
            <div className="flex flex-col items-center gap-6">
                <Loader2 className="animate-spin text-cyan-500" size={48} strokeWidth={1} />
                <span className="text-[10px] font-black tracking-[0.5em] uppercase animate-pulse">Initializing Sector Scan...</span>
            </div>
        </div>
    );

    return (
        <div className={`min-h-screen transition-all duration-1000 pt-48 pb-20 px-8 md:px-20 ${isDark ? 'bg-[#050505] text-white' : 'bg-white text-gray-900'}`}>
            
            {/* EDITORIAL HEADER */}
            <header className="max-w-[1600px] mx-auto mb-32 relative">
                <div className="flex flex-col gap-4">
                    <span className="text-[10px] font-black tracking-[0.6em] text-cyan-500 uppercase">
                        // SECTOR_{categoryFilter || 'ROOT'}
                    </span>
                    <h1 className="text-[12vw] leading-[0.8] font-black uppercase tracking-tighter transition-all duration-1000 select-none hover:tracking-tight">
                        {categoryFilter ? activeCategoryName : "Archive"}
                    </h1>
                </div>

                <div className="flex justify-between items-center mt-16 border-t border-current/10 pt-10">
                    <div className="hidden md:flex gap-12 text-[10px] font-black tracking-[0.4em] uppercase opacity-30">
                        <span>{filteredProducts.length} Assets Found</span>
                        <span>Hardware Registry v4.0</span>
                    </div>
                    
                    <div className="flex items-center gap-10">
                        {categoryFilter && (
                            <button onClick={() => setSearchParams({})} className="text-[10px] font-black uppercase text-cyan-500 hover:opacity-50 transition-all flex items-center gap-2">
                                <XCircle size={14} /> System Reset
                            </button>
                        )}
                        <div className="relative group">
                            <select 
                                value={sortBy} 
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-transparent text-[10px] font-black uppercase tracking-[0.3em] outline-none border-b border-current/20 pb-2 cursor-pointer appearance-none pr-8"
                            >
                                <option value="featured">Featured</option>
                                <option value="price-low">Value: Ascending</option>
                                <option value="price-high">Value: Descending</option>
                                <option value="alpha">A-Z Identity</option>
                            </select>
                            <ChevronDown size={12} className="absolute right-0 bottom-3 pointer-events-none opacity-40" />
                        </div>
                    </div>
                </div>
            </header>

            {/* PRODUCT GRID */}
            <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-32">
                {filteredProducts.map((product) => (
                    <div key={product.skuCode} className="group flex flex-col">
                        <div className="aspect-[4/5] overflow-hidden rounded-[3rem] relative bg-[#0a0a0a] border border-white/5 transition-all duration-1000 group-hover:rounded-none">
                            <img 
                                src={product.imageUrl || 'https://placehold.co/800x1000'} 
                                className="w-full h-full object-cover transition-all duration-[2s] group-hover:scale-110 opacity-70 group-hover:opacity-100 grayscale-[0.5] group-hover:grayscale-0" 
                                alt={product.name}
                            />
                            
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-center justify-center backdrop-blur-sm">
                                <button 
                                    onClick={() => setSelectedProduct(product)}
                                    className="bg-white text-black text-[10px] font-black px-10 py-5 rounded-full uppercase tracking-[0.2em] hover:bg-cyan-400 transition-all transform translate-y-8 group-hover:translate-y-0 shadow-2xl"
                                >
                                    Quick Analysis
                                </button>
                            </div>

                            <div className="absolute top-10 right-10 bg-black/80 backdrop-blur-2xl text-cyan-400 px-6 py-3 rounded-2xl text-[14px] font-black border border-white/10 shadow-2xl">
                                ${product.price}
                            </div>
                        </div>
                        
                        <div className="mt-10 flex justify-between items-start px-2">
                            <div className="flex flex-col gap-2">
                                <h3 className="text-2xl font-bold uppercase tracking-tighter leading-none group-hover:text-cyan-500 transition-colors">
                                    {product.name}
                                </h3>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    {product.category?.name || "Class_Undefined"}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* EMPTY STATE */}
            {filteredProducts.length === 0 && (
                <div className="py-40 text-center flex flex-col items-center gap-8 border-t border-white/5 mt-20">
                    <SearchX size={80} strokeWidth={0.5} className="opacity-10" />
                    <p className="text-[12px] font-bold uppercase tracking-[0.5em] opacity-30">No assets detected in current sector.</p>
                    <button onClick={() => setSearchParams({})} className="text-cyan-500 text-[10px] font-black uppercase tracking-[0.3em] border border-cyan-500/20 px-14 py-6 rounded-full hover:bg-cyan-500 hover:text-black transition-all">
                        Reset Global Search
                    </button>
                </div>
            )}

            {/* QUICK VIEW ANALYZER */}
            {selectedProduct && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 animate-in fade-in duration-500">
                    <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={() => setSelectedProduct(null)}></div>
                    <div className={`relative w-full max-w-6xl rounded-[4rem] overflow-hidden flex flex-col md:flex-row border transition-all duration-700
                        ${isDark ? 'bg-[#0a0f1d] border-white/10 text-white' : 'bg-white border-gray-100 text-gray-900'}`}>
                        
                        <button onClick={() => setSelectedProduct(null)} className="absolute top-10 right-10 z-10 p-4 hover:rotate-90 transition-all opacity-40 hover:opacity-100">
                            <X size={32} strokeWidth={1} />
                        </button>

                        <div className="md:w-1/2 aspect-square md:aspect-auto">
                            <img src={selectedProduct.imageUrl} className="w-full h-full object-cover" alt={selectedProduct.name} />
                        </div>

                        <div className="md:w-1/2 p-16 md:p-24 flex flex-col">
                            <span className="text-cyan-500 text-[10px] font-black tracking-[0.5em] uppercase mb-10">Unit Identification // {selectedProduct.skuCode}</span>
                            <h2 className="text-6xl font-black uppercase tracking-tighter mb-10 leading-[0.85]">{selectedProduct.name}</h2>
                            
                            <div className="grid grid-cols-2 gap-10 mb-14 py-10 border-y border-current/5">
                                <div className="flex items-center gap-4">
                                    <ShieldCheck size={24} className="text-cyan-500" />
                                    <span className="text-[11px] font-black uppercase tracking-widest opacity-40">Authenticity Verified</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Cpu size={24} className="text-cyan-500" />
                                    <span className="text-[11px] font-black uppercase tracking-widest opacity-40">System Registered</span>
                                </div>
                            </div>

                            <p className="text-sm font-medium leading-relaxed opacity-40 mb-16 max-w-md">
                                {selectedProduct.description || "Premium hardware asset. Original documentation provided upon acquisition."}
                            </p>

                            <div className="mt-auto flex items-center justify-between gap-10">
                                <div className="text-5xl font-black">${selectedProduct.price}</div>
                                <button 
                                    onClick={() => handleAddToCart(selectedProduct)}
                                    disabled={processingId !== null}
                                    className="flex-1 bg-cyan-500 text-black py-7 rounded-full font-black uppercase text-[12px] tracking-[0.3em] hover:bg-white transition-all active:scale-95 disabled:opacity-10"
                                >
                                    {processingId ? "Processing..." : "Acquire Unit"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductGallery;