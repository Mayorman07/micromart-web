import { Outlet, Navigate } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import { useTheme } from "../contexts/ThemeContext";

const UserLayout = () => {
    const { isDark } = useTheme();
    const isAuthenticated = !!localStorage.getItem("token");

    // Redirect to login if no token is found
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        /* transition-colors duration-500: Makes the theme swap feel like a fade, not a flash.
           dark:bg-[#0a0f1d]: The Tech background.
           bg-[#fafafa]: The Teeka background.
        */
        <div className="min-h-screen transition-colors duration-500 bg-[#fafafa] dark:bg-[#0a0f1d]">
            
            {/* Real item count should be fetched via API and passed here later */}
            <UserNavbar cartItemCount={0} />

            <main className="pt-32 pb-20 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* The ProductGallery or Orders page renders here */}
                    <Outlet /> 
                </div>
            </main>

            {/* Aesthetic Footer */}
            <footer className="py-12 text-center border-t border-gray-200 dark:border-white/5 transition-colors duration-500">
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-40 dark:text-white text-gray-900">
                DISTRIBUTED SYSTEMS & PREMIUM HARDWARE REGISTRY
                </p>
            </footer>
        </div>
    );
};

export default UserLayout;