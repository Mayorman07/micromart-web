import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

/**
 * AdminLayout Component
 * Provides the persistent Sidebar and Shell for all administrative routes.
 * Handles JWT verification and admin profile synchronization.
 */
const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [adminProfile, setAdminProfile] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  // Sync admin identity with Spring Boot backend
  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      try {
        // Targets specific administrative profile endpoint
        const adminEmail = "mayowa.hyde@gmail.com"; 
        const response = await axios.get(`http://127.0.0.1:7082/users/users/view/${adminEmail}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data && response.data.firstName) {
            setAdminProfile(response.data);
        }
      } catch (e) {
        console.error("Administrative Sync Interrupted:", e);
        if (e.response?.status === 403) handleLogout();
      } finally {
        setIsProfileLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/admin/login");
  };

  // Sidebar Navigation Config
  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
    { name: "Inventory", path: "/admin/inventory", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
    { name: "Operatives", path: "/admin/operatives", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
  ];

  return (
    <div className="flex min-h-screen bg-[#0B0F19] font-sans text-slate-300">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-72 fixed h-full z-20 bg-[#0f1422] border-r border-white/5 shadow-2xl flex flex-col">
        <div className="p-8 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20">M</div>
          <span className="text-xl font-black text-white tracking-widest uppercase">MicroMart</span>
        </div>

        <nav className="px-4 space-y-2 flex-1 mt-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-300 border border-transparent ${
                  isActive 
                    ? "bg-cyan-950/20 text-cyan-400 border-cyan-500/10 shadow-[0_0_25px_rgba(6,182,212,0.05)]" 
                    : "text-slate-500 hover:bg-white/5 hover:text-white"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                <span className="font-black text-[10px] uppercase tracking-[0.15em]">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* AUTHENTICATED PROFILE FOOTER */}
        <div className="p-4 border-t border-white/5 bg-black/10">
          <div className="flex flex-col gap-4">
            <div 
              className="flex items-center gap-3 group cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-all duration-300" 
              onClick={() => navigate(`/admin/view/mayowa.hyde@gmail.com`)}
            >
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-white font-black overflow-hidden shadow-inner">
                 {adminProfile?.firstName ? (
                   <span className="text-cyan-400 text-xs">{adminProfile.firstName[0]}{adminProfile.lastName[0]}</span>
                 ) : (
                   <div className="w-3 h-3 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                 )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-black text-white truncate uppercase tracking-tight">
                  {adminProfile?.firstName ? `${adminProfile.firstName} ${adminProfile.lastName}` : (isProfileLoading ? "Syncing..." : "Authorized Admin")}
                </p>
                <p className="text-[9px] text-cyan-500 font-black uppercase tracking-[0.2em]">Level 5 Access</p>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-950/10 border border-red-900/20 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all duration-300 group"
            >
              <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Terminate Session
            </button>
          </div>
        </div>
      </aside>

      {/* VIEWPORT CONTENT */}
      <main className="flex-1 ml-72 p-10 relative min-h-screen">
        {/* Atmospheric Blue Glow */}
        <div className="absolute top-0 left-0 w-full h-[600px] bg-cyan-900/5 blur-[150px] pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;