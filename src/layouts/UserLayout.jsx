import { useState, useEffect, useCallback } from "react";
import { Outlet } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import CartDrawer from "../components/CartDrawer";
import { useTheme } from "../contexts/ThemeContext";
import api from "../../src/services/api";

const UserLayout = () => {
    const { isDark } = useTheme();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const isAuthenticated = !!localStorage.getItem("token");

    const fetchCart = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            const response = await api.get("/cart/api/cart");
            setCartItems(response.data.items || []);
        } catch (err) {
            console.error("Registry Sync Error:", err);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const handleUpdateQuantity = async (skuCode, newQty) => {
        if (newQty < 1) return;
        try {
            await api.put("/cart/api/cart/update", { skuCode, quantity: newQty });
            setCartItems(prev => prev.map(item => 
                item.skuCode === skuCode ? { ...item, quantity: newQty } : item
            ));
        } catch (err) {
            console.error("Failed to update registry quantity:", err);
        }
    };

    const handleRemoveItem = async (skuCode) => {
        try {
            await api.delete(`/cart/api/cart/remove/${skuCode}`);
            setCartItems(prev => prev.filter(item => item.skuCode !== skuCode));
        } catch (err) {
            console.error("Failed to purge asset:", err);
        }
    };

    const handleClearCart = async () => {
        try {
            await api.delete("/cart/api/cart/clear");
            setCartItems([]);
        } catch (err) {
            console.error("Failed to clear registry:", err);
        }
    };

    return (
        <div className={`min-h-screen flex flex-col transition-colors duration-500 ${isDark ? 'bg-[#0a0f1d] text-white' : 'bg-[#fafafa] text-gray-900'}`}>
            
            <CartDrawer 
                isOpen={isCartOpen} 
                onClose={() => setIsCartOpen(false)} 
                cartItems={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onClearCart={handleClearCart}
            />

            <UserNavbar 
                cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)} 
                onOpenCart={() => setIsCartOpen(true)}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                isAuthenticated={isAuthenticated} 
            />

            {/* 🎯 ADJUSTED: Increased pt-32 to pt-52 to clear the tall triple-decker navbar */}
            <main className="flex-1 pt-52 pb-20 px-4 md:px-12 lg:px-16">
                <div className="max-w-7xl mx-auto">
                    <Outlet context={{ setIsCartOpen, setSearchTerm, fetchCart, isAuthenticated }} /> 
                </div>
            </main>

            <footer className="py-12 border-t border-gray-200 dark:border-white/5 transition-colors">
                <div className="max-w-7xl mx-auto px-8 flex justify-between items-center opacity-40">
                    <p className="text-[10px] uppercase tracking-[0.3em] font-black">
                        Hardware Registry System
                    </p>
                    <p className="text-[9px] uppercase font-bold tracking-widest">
                        &copy; 2026 MICROMART HUB
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default UserLayout;