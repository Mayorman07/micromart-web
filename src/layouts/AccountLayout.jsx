import { NavLink, Outlet, useLocation, Navigate } from "react-router-dom"; // 🎯 Added Navigate
import { User, Package, Mail, MessageSquare, Tag, Heart, Eye, Settings, CreditCard, MapPin, Bell } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const AccountLayout = () => {
    const { isDark } = useTheme();
    const location = useLocation();

    //  Check for the authentication token
    const isAuthenticated = !!localStorage.getItem("token");

    // Navigation configuration
    const navSections = [
        {
            title: "My Account",
            links: [
                { name: "Account Overview", path: "/account", icon: User, end: true },
                { name: "Orders", path: "/orders", icon: Package },
                { name: "Inbox", path: "/account/inbox", icon: Mail },
                { name: "Pending Reviews", path: "/account/reviews", icon: MessageSquare },
                { name: "Voucher", path: "/account/voucher", icon: Tag },
                { name: "Wishlist", path: "/account/wishlist", icon: Heart },
                { name: "Recently Viewed", path: "/account/recent", icon: Eye },
            ]
        },
        {
            title: "Settings",
            links: [
                { name: "Account Management", path: "/account/management", icon: Settings },
                { name: "Payment Settings", path: "/account/payments", icon: CreditCard },
                { name: "Address Book", path: "/account/address", icon: MapPin },
                { name: "Newsletter Preferences", path: "/account/newsletter", icon: Bell },
            ]
        }
    ];

    //  GUARD CLAUSE: If they aren't logged in, bounce them to login
    if (!isAuthenticated) {
        // Passing state={{ from: location }} allows you to redirect them back here AFTER they log in!
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return (
        <div className="flex flex-col md:flex-row gap-8 min-h-screen">
            {/* SIDEBAR */}
            <aside className={`w-full md:w-64 shrink-0 rounded-[2rem] p-6 h-fit sticky top-24 transition-colors duration-500
                ${isDark ? 'bg-[#161b2c] border border-white/5' : 'bg-white border border-gray-100 shadow-sm'}`}>
                
                {navSections.map((section, idx) => (
                    <div key={idx} className={idx !== 0 ? "mt-8" : ""}>
                        <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 
                            ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                            {section.title}
                        </h3>
                        <nav className="flex flex-col gap-1">
                            {section.links.map((link) => {
                                const Icon = link.icon;
                                const isActive = link.end ? location.pathname === link.path : location.pathname.startsWith(link.path);
                                
                                return (
                                    <NavLink
                                        key={link.name}
                                        to={link.path}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300
                                            ${isActive 
                                                ? (isDark ? 'bg-cyan-500/10 text-cyan-400 font-bold' : 'bg-cyan-50 text-cyan-700 font-bold') 
                                                : (isDark ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900')
                                            }`}
                                    >
                                        <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                        {link.name}
                                    </NavLink>
                                );
                            })}
                        </nav>
                    </div>
                ))}
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1">
                <Outlet />
            </div>
        </div>
    );
};

export default AccountLayout;