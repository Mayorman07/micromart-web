import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCmdKOpen, setIsCmdKOpen] = useState(false);
  const [adminProfile, setAdminProfile] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  // 🍎 ADMIN PROFILE SYNC
  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem("token");
      
      // If no token exists, redirect to login immediately
      if (!token) {
        console.warn("No token found, redirecting to login.");
        navigate("/admin/login");
        return;
      }

      try {
        const email = "mayowa.hyde@gmail.com"; 
        const response = await axios.get(`http://127.0.0.1:7082/users/users/view/${email}`, {
          headers: { 
            Authorization: `Bearer ${token}` // 🔑 Identifying as the Admin
          }
        });
        setAdminProfile(response.data);
      } catch (e) {
        console.error("Profile Sync Interrupted", e);
        // If the backend returns 403, the session might be expired
        if (e.response?.status === 403) {
          localStorage.removeItem("token");
          navigate("/admin/login");
        }
      } finally {
        setIsProfileLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  // 🎹 COMMAND PALETTE (Ctrl+K)
  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCmdKOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const menuItems = [
    { name: "Mission Control", path: "/admin/dashboard", icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
    { name: "Inventory", path: "/admin/products", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
    { name: "Operatives", path: "/admin/users", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
  ];

  return (
    <div className="flex min-h-screen bg-[#0B0F19] font-sans text-slate-300">
      
      {/* 🌑 SIDEBAR */}
      <aside className="w-72 fixed h-full z-20 bg-[#0f1422] border-r border-white/5 shadow-2xl flex flex-col">
        <div className="p-8 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
          <span className="text-xl font-bold text-white tracking-wider">MicroMart</span>
        </div>

        <nav className="px-4 space-y-2 flex-1 mt-4">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 border border-transparent ${
                  isActive 
                    ? "bg-cyan-950/30 text-cyan-400 border-cyan-500/20" 
                    : "text-slate-500 hover:bg-white/5 hover:text-white"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                <span className="font-medium text-sm">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* 👤 ADMIN FOOTER */}
        <div className="p-6 border-t border-white/5 bg-black/10">
          <div 
            className="flex items-center gap-3 group cursor-pointer" 
            onClick={() => navigate(`/admin/view/mayowa.hyde@gmail.com`)}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-700 border border-white/10 flex items-center justify-center text-white font-black overflow-hidden shadow-inner">
               {adminProfile?.firstName ? (
                 <span>{adminProfile.firstName[0]}{adminProfile.lastName[0]}</span>
               ) : (
                 <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
               )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">
                {isProfileLoading ? "Syncing..." : `${adminProfile?.firstName} ${adminProfile?.lastName}`}
              </p>
              <p className="text-[9px] text-cyan-500 font-mono uppercase tracking-widest">Clearance: Level 5</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 🚀 MAIN CONTENT */}
      <main className="flex-1 ml-72 p-8 relative min-h-screen">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-cyan-900/5 blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* 🎹 CMD+K OVERLAY */}
      {isCmdKOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-[#161b2c] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex items-center border-b border-slate-700 px-4 py-4">
                    <input autoFocus placeholder="Search command..." className="bg-transparent border-none focus:ring-0 text-white w-full" />
                </div>
                <div className="p-4 text-[10px] text-slate-500 uppercase font-bold tracking-widest">System Commands</div>
            </div>
            <div className="absolute inset-0 -z-10" onClick={() => setIsCmdKOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default AdminLayout;