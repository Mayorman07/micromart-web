import { useState } from "react"; // Added useState
import { Outlet, Navigate } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import CartDrawer from "../components/CartDrawer"; // Import your new component
import { useTheme } from "../contexts/ThemeContext";

const UserLayout = () => {
    const { isDark } = useTheme();
    const [isCartOpen, setIsCartOpen] = useState(false); // State to control drawer
    const isAuthenticated = !!localStorage.getItem("token");

    // Mock data for now - we'll connect this to your Cart API next
    const [cartItems, setCartItems] = useState([]);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Handlers for Cart actions
    const handleUpdateQuantity = (skuCode, newQty) => {
        if (newQty < 1) return;
        setCartItems(prev => prev.map(item => 
            item.skuCode === skuCode ? { ...item, quantity: newQty } : item
        ));
    };

    const handleRemoveItem = (skuCode) => {
        setCartItems(prev => prev.filter(item => item.skuCode !== skuCode));
    };

    return (
        <div className="min-h-screen transition-colors duration-500 bg-[#fafafa] dark:bg-[#0a0f1d]">
            
            {/* 1. The Sidebar Drawer */}
            <CartDrawer 
                isOpen={isCartOpen} 
                onClose={() => setIsCartOpen(false)} 
                cartItems={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
            />

            {/* 2. The Navbar - Now with toggle function passed in */}
            <UserNavbar 
                cartItemCount={cartItems.length} 
                onOpenCart={() => setIsCartOpen(true)} 
            />

            <main className="pt-32 pb-20 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <Outlet context={{ setIsCartOpen, setCartItems }} /> 
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