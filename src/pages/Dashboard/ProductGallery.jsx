import { useState, useEffect } from "react";
import api from "../../services/api";

/**
 * ProductGallery Component
 * The primary storefront for authenticated users to browse available products.
 */
const ProductGallery = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDisplayProducts = async () => {
        setLoading(true);
        try {
            // We use the same inventory endpoint but render it for customers
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

    if (loading) return (
        <div className="min-h-screen bg-[#0a0f1d] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0f1d] p-8">
            <header className="max-w-7xl mx-auto mb-12">
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Marketplace</h1>
                <p className="text-slate-400 font-medium">Discover premium tech and collectibles.</p>
            </header>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product) => (
                    <div key={product.skuCode} className="group bg-[#161b2c] rounded-[2.5rem] border border-white/5 overflow-hidden hover:border-cyan-500/30 transition-all hover:shadow-2xl hover:shadow-cyan-500/10">
                        {/* Product Image */}
                        <div className="aspect-square overflow-hidden relative">
                            <img 
                                src={product.imageUrl || 'https://placehold.co/600x600'} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                alt={product.name}
                            />
                            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                                <span className="text-cyan-400 font-black text-sm">${product.price}</span>
                            </div>
                        </div>

                        {/* Product Content */}
                        <div className="p-6">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{product.category}</span>
                            <h3 className="text-xl font-bold text-white mt-1 mb-4 leading-tight">{product.name}</h3>
                            
                            <button className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-cyan-500 hover:text-white transition-all uppercase text-xs tracking-widest">
                                View Product
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductGallery;