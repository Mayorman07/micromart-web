import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom"; 
import api from "../../services/api";
import { useTheme } from "../../contexts/ThemeContext";
import { SearchX } from "lucide-react"; // Added for empty state

const ProductGallery = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isDark } = useTheme();
    
    // Pull searchTerm from the UserLayout context
    const { setIsCartOpen, setCartItems, searchTerm } = useOutletContext();

    const fetchDisplayProducts = async () => {
        setLoading(true);
        try {
            const response = await api.get("/inventory/api/inventory/all");
            setProducts(response.data.content || []);
        } catch (err) {
            console.error("Gallery Load Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDisplayProducts();
    }, []);

    // FILTER LOGIC: Checks name and category against the search term
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes((searchTerm || "").toLowerCase()) ||
        product.category.toLowerCase().includes((searchTerm || "").toLowerCase())
    );

    const handleAddToCart = (product) => {
        setCartItems(prev => {
            const exists = prev.find(item => item.skuCode === product.skuCode);
            if (exists) {
                return prev.map(item => 
                    item.skuCode === product.skuCode 
                    ? { ...item, quantity: item.quantity + 1 } 
                    : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });

        setIsCartOpen(true);
    };

    if (loading) return (
        <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${isDark ? 'bg-[#0a0f1d]' : 'bg-[#fafafa]'}`}>
            <div className={`w-12 h-12 border-4 border-t-transparent rounded-full animate-spin ${isDark ? 'border-cyan-500' : 'border-cyan-600'}`}></div>
        </div>
    );

    return (
        <div className={`min-h-screen transition-colors duration-500 p-8 ${isDark ? 'bg-[#0a0f1d]' : 'bg-[#fafafa]'}`}>
            
            <header className="max-w-7xl mx-auto mb-12">
                <h1 className={`text-4xl tracking-tighter uppercase mb-2 transition-all duration-500
                    ${isDark ? 'font-black text-white' : 'font-serif italic text-gray-900 lowercase'}`}>
                    {searchTerm ? "Search Results" : "Marketplace"}
                </h1>
                <p className={`${isDark ? 'text-slate-400' : 'text-gray-500 italic font-light'}`}>
                    {searchTerm 
                        ? `Found ${filteredProducts.length} assets matching "${searchTerm}"`
                        : (isDark ? "// DISCOVER PREMIUM TECH & COLLECTIBLES" : "high-performance hardware for the next iteration")}
                </p>
            </header>

            {/* PRODUCT GRID */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <div key={product.skuCode} 
                            className={`group rounded-[2rem] overflow-hidden transition-all duration-500
                            ${isDark 
                                ? 'bg-[#161b2c] border border-white/5 hover:border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/10' 
                                : 'bg-white border border-gray-100 hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-500/5'}`}>
                            
                            <div className="aspect-square overflow-hidden relative bg-gray-50">
                                <img 
                                    src={product.imageUrl || 'https://placehold.co/600x600'} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    alt={product.name}
                                />
                                <div className={`absolute top-4 right-4 px-4 py-2 rounded-xl transition-all duration-500
                                    ${isDark ? 'bg-black/60 backdrop-blur-md border border-white/10 text-cyan-400' : 'bg-cyan-50/90 text-cyan-700 border border-cyan-100 shadow-sm'}`}>
                                    <span className="font-black text-sm">${product.price}</span>
                                </div>
                            </div>

                            <div className="p-6">
                                <span className={`text-[9px] font-black uppercase tracking-[0.2em] transition-colors
                                    ${isDark ? 'text-slate-500' : 'text-cyan-600/60'}`}>
                                    {product.category}
                                </span>
                                
                                <h3 className={`text-xl mt-1 mb-6 leading-tight transition-all duration-500 h-14 overflow-hidden
                                    ${isDark ? 'font-bold text-white uppercase tracking-tighter' : 'font-serif italic text-gray-800'}`}>
                                    {product.name}
                                </h3>
                                
                                <button 
                                    onClick={() => handleAddToCart(product)}
                                    className={`w-full py-4 rounded-xl transition-all uppercase text-[10px] font-black tracking-widest active:scale-95
                                    ${isDark 
                                        ? 'bg-white text-black hover:bg-cyan-500 hover:text-white shadow-lg' 
                                        : 'bg-cyan-500 text-white hover:bg-cyan-600 shadow-lg shadow-cyan-500/20'}`}>
                                    Add to Registry
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    /* EMPTY STATE */
                    <div className="col-span-full py-32 flex flex-col items-center justify-center text-center opacity-40">
                        <SearchX size={48} strokeWidth={1} className="mb-4" />
                        <p className="text-[10px] uppercase font-bold tracking-[0.3em]">
                            No matching assets found in the registry.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductGallery;