import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { Loader2, ArrowLeft, ShoppingCart, ShieldCheck } from "lucide-react";

/**
 * ProductDetail Component
 * Responsible for rendering comprehensive asset specifications and handling 
 * cart deployment logic. Utilizes SKU-based routing for SEO and deep-linking.
 */
const ProductDetail = () => {
    // Parameter extraction and navigation hooks
    const { skuCode } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    
    // Access global layout context for cart state synchronization
    const context = useOutletContext() || {};
    const { fetchCart, isAuthenticated } = context;

    // Component-level state management
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    /**
     * Effect: Fetch product specifications on mount or SKU change.
     * Uses absolute pathing to prevent relative route resolution errors.
     */
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Ensure the backend endpoint /products/sku/{skuCode} is active
                const response = await api.get(`/products/products/sku/${skuCode}`);
                setProduct(response.data);
            } catch (err) {
                showToast("Asset synchronization failed: SKU not found in registry", "error");
                navigate("/");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [skuCode, navigate, showToast]);

    /**
     * Logic: Add current asset to cart.
     * Includes authentication check and global cart state refresh.
     */
    const handleAddToCart = async () => {
        if (!isAuthenticated) return navigate("/login");

        setIsAdding(true);
        try {
            await api.post("/cart/api/cart/items", {
                skuCode: product.skuCode,
                quantity: 1
            });
            
            // Trigger navbar update to reflect current cart count
            if (fetchCart) await fetchCart();
            showToast(`${product.name} successfully deployed to cart`, "success");
        } catch (err) {
            showToast("Deployment failed: Inventory service error", "error");
        } finally {
            setIsAdding(false);
        }
    };

    // Global loading state intercept
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505]">
            <Loader2 className="animate-spin text-cyan-500" size={32} />
        </div>
    );

    // Stock availability validation
    const isOutOfStock = product?.quantity === 0 || product?.stockQuantity === 0;

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-40 pb-20 px-8 md:px-16">
            <div className="max-w-[1400px] mx-auto">
                
                {/* Backwards navigation control */}
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 hover:text-cyan-500 transition-colors mb-12"
                >
                    <ArrowLeft size={14} /> Return to Registry
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    
                    {/* Visual Asset Sector */}
                    <div className="relative group">
                        <div className="aspect-square rounded-[3rem] overflow-hidden border border-white/5 bg-[#0a0a0a]">
                            <img 
                                src={product?.imageUrl || 'https://placehold.co/800x800'} 
                                alt={product?.name}
                                className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isOutOfStock ? 'grayscale opacity-50' : ''}`}
                            />
                        </div>
                        {isOutOfStock && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="bg-black/80 backdrop-blur-md border border-white/10 px-8 py-3 rounded-full text-[10px] font-black tracking-widest uppercase text-red-500">
                                    Depleted
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Meta Data Sector */}
                    <div className="flex flex-col justify-center">
                        <div className="inline-block bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-[10px] font-black px-4 py-2 rounded-lg tracking-[0.3em] uppercase mb-6 w-fit">
                            Authenticity Verified
                        </div>
                        
                        <h1 className="text-7xl font-black uppercase italic leading-none mb-4">
                            {product?.name}
                        </h1>
                        
                        <div className="flex items-center gap-4 mb-8">
                            <span className="text-3xl font-light text-gray-400">$</span>
                            <span className="text-5xl font-bold tracking-tighter text-white">
                                {product?.price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                        </div>

                        <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-xl">
                            {product?.description || "High-performance asset engineered for the MicroMart ecosystem. Fully verified registry entry with guaranteed logistics compatibility."}
                        </p>

                        {/* Interactive Controls */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            <button 
                                onClick={handleAddToCart}
                                disabled={isAdding || isOutOfStock}
                                className={`flex-1 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl ${
                                    isOutOfStock 
                                    ? 'bg-gray-900 text-gray-600 cursor-not-allowed border border-white/5' 
                                    : 'bg-white text-black hover:bg-cyan-500'
                                }`}
                            >
                                {isAdding ? (
                                    <Loader2 className="animate-spin" size={18} />
                                ) : isOutOfStock ? (
                                    "Unavailable"
                                ) : (
                                    <>
                                        <ShoppingCart size={18} /> Add to Cart
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Technical Specification Grid */}
                        <div className="grid grid-cols-2 gap-4 pt-10 border-t border-white/5">
                            <div>
                                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">SKU Identifier</p>
                                <p className="font-mono text-sm text-cyan-500">{product?.skuCode}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">Security Status</p>
                                <p className="text-sm flex items-center gap-2">
                                    <ShieldCheck size={14} className="text-emerald-500" /> Layer 7 Encrypted
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;