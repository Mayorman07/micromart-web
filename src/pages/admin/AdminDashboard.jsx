import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * AdminDashboard Component
 * Central management interface for system-wide metrics, inventory status, 
 * and user account management.
 */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [searchEmail, setSearchEmail] = useState("");

  /**
   * Navigates to the detailed user management view.
   * Validates that the email input is not empty before routing.
   */
  const handleViewUserDetail = () => {
    const email = searchEmail.trim();
    
    if (!email) return; 
    
    // Route mapping defined in App.jsx: /admin/view/:email
    navigate(`/admin/view/${email}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* --- Page Header --- */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Administrator Dashboard</h1>
          <p className="text-slate-500 mt-1 font-medium italic">System Infrastructure • MicroMart Enterprise v2.1</p>
        </div>
        <div className="px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-[10px] font-bold text-cyan-400 tracking-widest uppercase">
          Status: Secure
        </div>
      </div>

      {/* --- Metrics Grid: Financials & Stock Overview --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Analytics Card */}
        <div className="lg:col-span-2 bg-[#161b2c] p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
             <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Revenue (Gross)</p>
          <h2 className="text-7xl font-black text-white mt-4 tracking-tighter">$12,450</h2>
          <div className="flex items-center gap-2 mt-4 text-emerald-500 font-bold">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
            <span className="text-xs tracking-widest uppercase">12% Growth Velocity</span>
          </div>
        </div>

        {/* Inventory Summary Card */}
        <div className="bg-[#161b2c] p-8 rounded-[2.5rem] border border-white/5 flex flex-col justify-between shadow-xl">
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Inventory Status</p>
            <p className="text-xs text-cyan-500 font-mono mt-1">PRIMARY-STORAGE-A</p>
          </div>
          <div className="py-6">
            <h3 className="text-5xl font-black text-white">42</h3>
            <p className="text-[10px] text-slate-500 mt-2">Active units remaining in stock</p>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase transition-all">Restock</button>
            <button className="flex-1 py-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[10px] font-black uppercase transition-all">Audit</button>
          </div>
        </div>
      </div>

      {/* --- Management Grid: User Controls & Quick Actions --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* User Account Management Interface */}
        <div className="bg-[#161b2c] p-8 rounded-[2.5rem] border border-white/5 flex flex-col gap-6 shadow-xl">
          <p className="text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">Account Management</p>
          
          <div className="space-y-4">
            <div className="relative">
              <input 
                type="email"
                placeholder="Enter user email..."
                className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 px-5 text-sm text-white focus:border-cyan-500 outline-none transition-all placeholder:text-slate-700 font-medium"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
              />
              <button className="absolute right-2 top-2 px-4 py-2 bg-cyan-500 text-black text-[10px] font-black rounded-xl hover:bg-cyan-400 transition-all uppercase">
                Search
              </button>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 py-4 px-2 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase hover:bg-red-500/20 transition-all leading-tight">
                Deactivate<br/>Account
              </button>
              <button 
                onClick={handleViewUserDetail}
                className="flex-1 py-4 px-2 rounded-2xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase hover:bg-white/10 transition-all leading-tight"
              >
                View User<br/>Details
              </button>
            </div>
          </div>
        </div>

        {/* Action: Create New Product Entry */}
        <div 
          onClick={() => navigate('/admin/products')}
          className="group cursor-pointer bg-gradient-to-br from-cyan-600 to-blue-700 p-8 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 hover:scale-[1.02] transition-transform shadow-2xl shadow-cyan-500/20"
        >
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white group-hover:rotate-90 transition-transform duration-500">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
          </div>
          <p className="text-2xl font-black text-white text-center tracking-tighter uppercase">Initialize<br/>New Product</p>
        </div>

        {/* Action: Historical Audit Logs (Current: Disabled/Future Feature) */}
        <div className="bg-[#161b2c] p-8 rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center gap-4 opacity-40 grayscale cursor-not-allowed">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          </div>
          <p className="text-2xl font-black text-slate-500 text-center uppercase tracking-tighter">System<br/>Audit Logs</p>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;