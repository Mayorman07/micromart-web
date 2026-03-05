import { useState, useEffect, useCallback } from "react";
import { Outlet } from "react-router-dom"; // Removed Navigate
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
    
    // Determine auth state but DON'T force a redirect here anymore
    const isAuthenticated = !!localStorage.getItem("token");

    const fetchCart = useCallback(async () => {
        try {
            const response = await api.get("/cart/api/cart");
            setCartItems(response.data.items || []);
        } catch (err) {
            console.error("Registry Sync Error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Only fetch the cart if they are actually logged in
    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        } else {
            setLoading(false);
            setCartItems([]); // Ensure guests have an empty cart state
        }
    }, [isAuthenticated, fetchCart]);

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

    // THE LOGIN WALL IS GONE! Guests can now render the UI below.

    return (
        <div className="min-h-screen transition-colors duration-500 bg-[#fafafa] dark:bg-[#0a0f1d]">
            
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
                isAuthenticated={isAuthenticated} // Pass to Navbar to toggle Login/Profile buttons
            />

            <main className="pt-32 pb-20 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* 🎯 Pass isAuthenticated down so ProductGallery can guard the Add to Cart button */}
                    <Outlet context={{ setIsCartOpen, setCartItems, searchTerm, fetchCart, isAuthenticated }} /> 
                </div>
            </main>

            <footer className="py-12 text-center border-t border-gray-200 dark:border-white/5 transition-colors duration-500">
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-40 dark:text-white text-gray-900">
                    DISTRIBUTED SYSTEMS & PREMIUM HARDWARE REGISTRY
                </p>
            </footer>
        </div>
    );
};

export default UserLayout;