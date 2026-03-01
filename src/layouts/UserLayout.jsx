import { useState, useEffect, useCallback } from "react";
import { Outlet, Navigate } from "react-router-dom";
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

    // 1. Fetch Cart: Matches @GetMapping in CartController
    const fetchCart = useCallback(async () => {
        try {
            const response = await api.get("/cart/api/cart");
            // Mapping to the 'items' field in your CartResponse
            setCartItems(response.data.items || []);
        } catch (err) {
            console.error("Registry Sync Error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) fetchCart();
    }, [isAuthenticated, fetchCart]);

    // 2. Persistent Quantity Update: Matches @PutMapping("/update")
    const handleUpdateQuantity = async (skuCode, newQty) => {
        if (newQty < 1) return;
        try {
            // Sending CartRequest body as expected by your Controller
            await api.put("/cart/api/cart/update", {
                skuCode: skuCode,
                quantity: newQty
            });
            
            // Optimistic UI update
            setCartItems(prev => prev.map(item => 
                item.skuCode === skuCode ? { ...item, quantity: newQty } : item
            ));
        } catch (err) {
            console.error("Failed to update registry quantity:", err);
        }
    };

    // 3. Persistent Removal: Matches @DeleteMapping("/remove/{skuCode}")
    const handleRemoveItem = async (skuCode) => {
        try {
            await api.delete(`/cart/api/cart/remove/${skuCode}`);
            setCartItems(prev => prev.filter(item => item.skuCode !== skuCode));
        } catch (err) {
            console.error("Failed to purge asset:", err);
        }
    };

    // 4. Clear Registry: Matches @DeleteMapping("/clear")
    const handleClearCart = async () => {
        try {
            await api.delete("/cart/api/cart/clear");
            setCartItems([]);
        } catch (err) {
            console.error("Failed to clear registry:", err);
        }
    };

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen transition-colors duration-500 bg-[#fafafa] dark:bg-[#0a0f1d]">
            
            <CartDrawer 
                isOpen={isCartOpen} 
                onClose={() => setIsCartOpen(false)} 
                cartItems={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onClearCart={handleClearCart} // New handler added
            />

            <UserNavbar 
                cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)} 
                onOpenCart={() => setIsCartOpen(true)}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm} 
            />

            <main className="pt-32 pb-20 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <Outlet context={{ setIsCartOpen, setCartItems, searchTerm, fetchCart }} /> 
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