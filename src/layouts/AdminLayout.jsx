import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCmdKOpen, setIsCmdKOpen] = useState(false);

  // 🎹 1. COMMAND PALETTE LOGIC
  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCmdKOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Navigation Items
  const menuItems = [
    { name: "Mission Control", path: "/admin/dashboard", icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
    { name: "Inventory", path: "/admin/products", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
    { name: "Operatives", path: "/admin/users", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
  ];

  return (
    <div className="flex min-h-screen bg-[#0B0F19] font-sans text-slate-300 selection:bg-cyan-500/30 selection:text-cyan-100">
      
      {/* 🌑 SIDEBAR (Tactile Dark Metal) */}
      <aside className="w-72 fixed h-full z-20 bg-[#0f1422] border-r border-white/5 shadow-2xl flex flex-col">
        {/* Brand Area */}
        <div className="p-8 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]">M</div>
          <span className="text-xl font-bold text-white tracking-wider">MicroMart</span>
        </div>

        {/* Navigation */}
        <nav className="px-4 space-y-2 flex-1">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group border border-transparent ${
                  isActive 
                    ? "bg-cyan-950/30 text-cyan-400 border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]" 
                    : "hover:bg-white/5 hover:text-white"
                }`}
              >
                <svg className={`w-5 h-5 ${isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-cyan-200"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                <span className="font-medium text-sm">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile Snippet */}
        <div className="p-6 border-t border-white/5">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-700 border border-slate-600"></div>
                <div>
                    <p className="text-sm font-bold text-white">Admin User</p>
                    <p className="text-xs text-slate-500">Level 5 Access</p>
                </div>
            </div>
        </div>
      </aside>

      {/* 🚀 MAIN CONTENT */}
      <main className="flex-1 ml-72 p-8 relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-cyan-900/10 blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* 🎹 COMMAND PALETTE OVERLAY (CMD+K) */}
      {isCmdKOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm animate-[fadeIn_0.1s]">
            <div className="w-full max-w-2xl bg-[#161b2c] border border-slate-700 rounded-2xl shadow-2xl shadow-black overflow-hidden flex flex-col animate-[scaleIn_0.1s]">
                
                {/* Search Input */}
                <div className="flex items-center border-b border-slate-700 px-4 py-4">
                    <svg className="w-5 h-5 text-slate-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input 
                        autoFocus
                        placeholder="Type a command or search..."
                        className="bg-transparent border-none focus:ring-0 text-white text-lg w-full placeholder-slate-600"
                    />
                    <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700">ESC</span>
                </div>

                {/* Results (Mocked for now) */}
                <div className="p-2">
                    <div className="text-xs font-bold text-slate-500 px-3 py-2 uppercase tracking-wider">Quick Actions</div>
                    <button onClick={() => { navigate('/admin/products'); setIsCmdKOpen(false); }} className="w-full flex items-center justify-between px-4 py-3 hover:bg-cyan-900/20 text-slate-300 hover:text-white rounded-lg transition-colors group">
                        <div className="flex items-center gap-3">
                            <span className="w-5 h-5 border border-slate-600 rounded flex items-center justify-center text-xs group-hover:border-cyan-500 group-hover:text-cyan-400">+</span>
                            <span>Create New Product</span>
                        </div>
                        <span className="text-xs text-slate-600">P</span>
                    </button>
                    <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-cyan-900/20 text-slate-300 hover:text-white rounded-lg transition-colors group">
                        <div className="flex items-center gap-3">
                            <span className="w-5 h-5 border border-slate-600 rounded flex items-center justify-center text-xs group-hover:border-cyan-500 group-hover:text-cyan-400">#</span>
                            <span>Check Inventory Status</span>
                        </div>
                        <span className="text-xs text-slate-600">I</span>
                    </button>
                </div>
                
                <div className="bg-[#0f1422] px-4 py-2 border-t border-slate-700 text-[10px] text-slate-500 flex justify-between">
                    <span>MicroMart OS v2.0</span>
                    <div className="flex gap-2">
                        <span>Select ↵</span>
                        <span>Navigate ↑↓</span>
                    </div>
                </div>
            </div>
            
            {/* Click outside to close */}
            <div className="absolute inset-0 -z-10" onClick={() => setIsCmdKOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default AdminLayout;