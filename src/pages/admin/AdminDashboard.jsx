import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const navigate = useNavigate();
    
    // --- State Management for Real-time Operatives ---
    const [stats, setStats] = useState({ revenue: 12450.00, activeUsers: 142 });
    const [buggyStock, setBuggyStock] = useState(null);
    const [searchEmail, setSearchEmail] = useState("");
    const [foundUser, setFoundUser] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:7082/inventory/api/inventory/sku-code/RC-BUG-119");
            if (response.data && response.data.length > 0) {
                setBuggyStock(response.data[0].quantity);
            }
        } catch (error) { console.error("Sync Error:", error); }
    };

    // --- High-Level Operative Actions ( steve jobs would want these fast ) ---
    
    const handlePromoteManager = async (email) => {
        setActionLoading(true);
        try {
            // Mapping to your PUT /{userId}/roles/manager endpoint
            await axios.put(`http://127.0.0.1:7082/users/users/${email}/roles/manager`);
            alert(`User ${email} promoted to Manager Level.`);
        } catch (e) { alert("Promotion Failed: Hierarchy check required."); }
        setActionLoading(false);
    };

    const handleDeactivateUser = async (email) => {
        if (!window.confirm("Confirm suspension of operative?")) return;
        try {
            await axios.post(`http://127.0.0.1:7082/users/users/${email}`);
            alert("Operative deactivated.");
        } catch (e) { alert("Deactivation Error."); }
    };

    const adjustStock = async (sku, amount, type) => {
        try {
            const endpoint = type === 'add' ? 'add' : 'deduct';
            await axios.put(`http://127.0.0.1:7082/inventory/api/inventory/${endpoint}`, {
                skuCode: sku,
                quantity: amount
            });
            fetchInventory(); // Refresh the pulse
        } catch (e) { console.error("Inventory Sync Failed."); }
    };

    return (
        <div className="space-y-8 animate-[fadeIn_0.6s_ease-out] pb-20">
            
            {/* 🍎 APPLE-STYLE HEADER */}
            <div className="flex justify-between items-center border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter">Mission Control</h1>
                    <p className="text-slate-500 font-medium">Core Infrastructure Management • MicroMart v2.1</p>
                </div>
                <div className="flex gap-4">
                    <div className="px-4 py-2 bg-slate-900/50 rounded-full border border-white/10 text-xs font-mono text-cyan-400 flex items-center gap-2">
                        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></span>
                        GATEWAY: SECURE
                    </div>
                </div>
            </div>

            {/* 🍱 THE ACTIONABLE BENTO GRID */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* CARD 1: SURVEILLANCE (REVENUE) */}
                <div className="md:col-span-8 bg-[#161b2c] border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                        <svg className="w-40 h-40 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.78-1.66-2.63-1.66-2.11 0-2.62 1.04-2.62 1.5 0 .81.44 1.54 2.32 2.02 2.8.74 4.52 1.82 4.52 3.83 0 1.6-1.06 2.94-3.48 3.36z"/></svg>
                    </div>
                    <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-4">Total Revenue</h3>
                    <div className="text-7xl font-black text-white mb-2 tracking-tighter">
                        ${stats.revenue.toLocaleString()}
                    </div>
                    <div className="text-emerald-400 font-mono text-lg font-bold">▲ 12% VELOCITY</div>
                </div>

                {/* CARD 2: QUICK INVENTORY ADJUSTMENT */}
                <div className="md:col-span-4 bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between group">
                    <div>
                        <h3 className="text-slate-400 text-xs font-bold uppercase mb-6">Inventory Pulse: RC-BUG-119</h3>
                        <div className="text-5xl font-black text-white mb-2">{buggyStock ?? "--"}</div>
                        <p className="text-slate-500 text-xs">Units remaining in Sector 7</p>
                    </div>
                    <div className="flex gap-2 mt-6">
                        <button 
                            onClick={() => adjustStock('RC-BUG-119', 1, 'add')}
                            className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-bold transition-all"
                        >
                            + Add 1
                        </button>
                        <button 
                            onClick={() => adjustStock('RC-BUG-119', 1, 'deduct')}
                            className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-red-400 font-bold transition-all"
                        >
                            - Deduct 1
                        </button>
                    </div>
                </div>

                {/* CARD 3: USER SEARCH & COMMAND (INTEGRATED ENDPOINTS) */}
                <div className="md:col-span-6 bg-[#161b2c] border border-white/5 rounded-[2.5rem] p-8 group">
                    <h3 className="text-slate-400 text-xs font-bold uppercase mb-6 text-center">Operative Management</h3>
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search email (e.g. admin@micromart.com)"
                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-600"
                            value={searchEmail}
                            onChange={(e) => setSearchEmail(e.target.value)}
                        />
                        <button 
                            onClick={() => handlePromoteManager(searchEmail)}
                            className="absolute right-2 top-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-all"
                        >
                            {actionLoading ? "..." : "PROMOTE"}
                        </button>
                    </div>
                    <div className="flex gap-4 mt-6">
                        <button 
                            onClick={() => handleDeactivateUser(searchEmail)}
                            className="flex-1 py-4 bg-red-900/20 hover:bg-red-900/40 border border-red-500/20 rounded-2xl text-red-500 text-sm font-black transition-all"
                        >
                            DEACTIVATE ACCOUNT
                        </button>
                        <button 
                            onClick={() => navigate(`/admin/view/${searchEmail}`)}
                            className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl text-white text-sm font-black transition-all"
                        >
                            VIEW FULL DOSSIER
                        </button>
                    </div>
                </div>

                {/* CARD 4: SYSTEM COMMANDS */}
                <div className="md:col-span-6 grid grid-cols-2 gap-6">
                    <button 
                        onClick={() => navigate("/admin/products")}
                        className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-[2rem] p-8 text-left group hover:scale-[1.03] transition-all shadow-2xl shadow-cyan-900/20"
                    >
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
                        </div>
                        <h4 className="text-white font-black text-xl">Create<br/>Product</h4>
                    </button>

                    <button className="bg-slate-800/50 border border-white/5 rounded-[2rem] p-8 text-left hover:bg-slate-800 transition-all">
                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-slate-400 mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                        </div>
                        <h4 className="text-slate-300 font-black text-xl">Audit<br/>Logs</h4>
                    </button>
                </div>
            </div>
            
            {/* FOOTER: SYSTEM INFRASTRUCTURE STATUS */}
            <div className="mt-12 p-6 bg-slate-900/30 rounded-3xl border border-white/5 flex justify-between items-center opacity-60">
                 <div className="flex gap-6 text-[10px] font-mono tracking-widest text-slate-500">
                    <div>PRODUCT_SVC: <span className="text-emerald-400 font-bold">v2.1.0</span></div>
                    <div>INVENTORY_SVC: <span className="text-emerald-400 font-bold">v1.0.4</span></div>
                    <div>GATEWAY: <span className="text-cyan-400 font-bold">ENCRYPTED</span></div>
                 </div>
                 <div className="text-[10px] text-slate-600 font-bold uppercase">© 2026 MICROMART QUANTUM DEPT.</div>
            </div>
        </div>
    );
};

export default AdminDashboard;