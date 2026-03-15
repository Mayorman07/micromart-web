import { NavLink, Outlet, useLocation, Navigate } from "react-router-dom";
import { User, Package, Tag, CreditCard } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const AccountLayout = () => {
    const { isDark } = useTheme();
    const location = useLocation();
    const isAuthenticated = !!localStorage.getItem("token");

    const navSections = [
        {
            title: "My Account",
            links: [
                { name: "Account Overview", path: "/account", icon: User, end: true },
                { name: "Orders", path: "/orders", icon: Package },
                { name: "Voucher", path: "/account/voucher", icon: Tag },
            ]
        },
        {
            title: "Settings",
            links: [
                { name: "Payment Settings", path: "/account/payments", icon: CreditCard },
            ]
        }
    ];

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return (
        <div className="flex flex-col md:flex-row gap-8 min-h-screen">
            
            <aside className={`w-full md:w-64 shrink-0 rounded-[2.5rem] p-7 pt-12 h-fit sticky top-52 transition-all duration-500
                ${isDark 
                    ? 'bg-[#111827] border border-white/5 shadow-2xl shadow-black/40' 
                    : 'bg-white border border-gray-100 shadow-sm'}`}>
                
                {navSections.map((section, idx) => (
                    <div key={idx} className={idx !== 0 ? "mt-12" : "mt-0"}>
                        
                        <h3 className={`text-[11px] font-black uppercase tracking-[0.3em] mb-6 px-2
                            ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {section.title}
                        </h3>
                        
                        <nav className="flex flex-col gap-2">
                            {section.links.map((link) => {
                                const Icon = link.icon;
                                const isActive = link.end 
                                    ? location.pathname === link.path 
                                    : location.pathname.startsWith(link.path);
                                
                                return (
                                    <NavLink
                                        key={link.name}
                                        to={link.path}
                                        className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-[13px] transition-all duration-300
                                            ${isActive 
                                                ? (isDark ? 'bg-cyan-500/10 text-cyan-400 font-black' : 'bg-cyan-50 text-cyan-700 font-black') 
                                                : (isDark ? 'text-[#9ca3af] hover:bg-white/5 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900')
                                            }`}
                                    >
                                        <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                        <span className="tracking-tight font-bold">{link.name}</span>
                                    </NavLink>
                                );
                            })}
                        </nav>
                    </div>
                ))}
            </aside>

            <div className="flex-1 min-h-[500px] animate-in fade-in slide-in-from-bottom-2 duration-700">
                <Outlet />
            </div>
        </div>
    );
};

export default AccountLayout;