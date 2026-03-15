import { NavLink, Outlet, useLocation, Navigate } from "react-router-dom";
import { User, Package, Settings, CreditCard, MapPin } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const AccountLayout = () => {
    const { isDark } = useTheme();
    const location = useLocation();

    const isAuthenticated = !!localStorage.getItem("token");

    // REFINED NAVIGATION: Only functional routes are included to prevent 404s
    const navSections = [
        {
            title: "My Account",
            links: [
                { name: "Account Overview", path: "/account", icon: User, end: true },
                { name: "Orders", path: "/orders", icon: Package },
            ]
        },
        {
            title: "Settings",
            links: [
                { name: "Account Management", path: "/account/management", icon: Settings },
                { name: "Payment Settings", path: "/account/payments", icon: CreditCard },
                { name: "Address Book", path: "/account/address", icon: MapPin },
            ]
        }
    ];

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return (
        <div className="flex flex-col md:flex-row gap-8 min-h-screen">
            {/* SIDEBAR: Standardized to match the new high-contrast dark mode */}
            <aside className={`w-full md:w-64 shrink-0 rounded-[2rem] p-6 h-fit sticky top-24 transition-all duration-500
                ${isDark 
                    ? 'bg-[#111827] border border-white/5 shadow-2xl shadow-black/20' 
                    : 'bg-white border border-gray-100 shadow-sm'}`}>
                
                {navSections.map((section, idx) => (
                    <div key={idx} className={idx !== 0 ? "mt-10" : ""}>
                        <h3 className={`text-[10px] font-black uppercase tracking-[0.25em] mb-5 
                            ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                            {section.title}
                        </h3>
                        <nav className="flex flex-col gap-1.5">
                            {section.links.map((link) => {
                                const Icon = link.icon;
                                const isActive = link.end 
                                    ? location.pathname === link.path 
                                    : location.pathname.startsWith(link.path);
                                
                                return (
                                    <NavLink
                                        key={link.name}
                                        to={link.path}
                                        className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[13px] transition-all duration-300
                                            ${isActive 
                                                ? (isDark ? 'bg-cyan-500/10 text-cyan-400 font-black' : 'bg-cyan-50 text-cyan-700 font-black') 
                                                : (isDark ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900')
                                            }`}
                                    >
                                        <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                        <span className="tracking-tight">{link.name}</span>
                                    </NavLink>
                                );
                            })}
                        </nav>
                    </div>
                ))}
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 animate-in fade-in duration-700">
                <Outlet />
            </div>
        </div>
    );
};

export default AccountLayout;