import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        revenue: 12450.00,
        activeUsers: 142,
        lowStockCount: 0
    });
    
    // We'll store our specific product check here
    const [buggyStock, setBuggyStock] = useState(null);

    useEffect(() => {
        // 🛠️ REAL DATA CHECK: Fetching stock for the product you just created
        const checkStock = async () => {
            try {
                // Using the endpoint you verified earlier
                const response = await axios.get("http://127.0.0.1:7082/inventory/api/inventory/sku-code/RC-BUG-119");
                if (response.data && response.data.length > 0) {
                    setBuggyStock(response.data[0].quantity); // Should be 45
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            }
        };

        checkStock();
    }, []);

    // Reusable Dark Card
    const StatCard = ({ title, value, subtext, accentColor, icon }) => (
        <div className="bg-[#161b2c] border border-slate-800 rounded-3xl p-6 relative overflow-hidden group hover:border-slate-600 transition-all">
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${accentColor}`}>
                {icon}
            </div>
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">{title}</h3>
            <div className="text-3xl font-bold text-white mb-1">{value}</div>
            <div className={`text-xs font-mono ${accentColor.replace('text-', 'text-opacity-80 ')}`}>{subtext}</div>
        </div>
    );

    return (
        <div className="space-y-8 animate-[fadeIn_0.5s]">
            
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Mission Control</h1>
                    <p className="text-slate-400 mt-2 text-sm">Real-time surveillance of MicroMart operations.</p>
                </div>
                <div className="flex gap-3">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        SYSTEM ONLINE
                    </span>
                </div>
            </div>

            {/* 🍱 DARK BENTO GRID */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                {/* 1. Revenue (Wide) */}
                <div className="md:col-span-2">
                    <StatCard 
                        title="Total Revenue" 
                        value={`$${stats.revenue.toLocaleString()}`} 
                        subtext="▲ 12% from yesterday"
                        accentColor="text-cyan-400"
                        icon={<svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.78-1.66-2.63-1.66-2.11 0-2.62 1.04-2.62 1.5 0 .81.44 1.54 2.32 2.02 2.8.74 4.52 1.82 4.52 3.83 0 1.6-1.06 2.94-3.48 3.36z"/></svg>}
                    />
                </div>

                {/* 2. Real Stock Check (The 'Proof' it works) */}
                <div className="md:col-span-1 bg-[#161b2c] border border-slate-800 rounded-3xl p-6 relative group hover:border-blue-500/50 transition-all">
                    <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">NitroX Buggy Stock</h3>
                    <div className="flex items-center justify-between">
                        <div className="text-4xl font-bold text-white">
                            {buggyStock !== null ? buggyStock : <span className="text-slate-600 text-xl animate-pulse">Scanning...</span>}
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                            📦
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-slate-500">
                        SKU: <span className="font-mono text-slate-300">RC-BUG-119</span>
                    </div>
                </div>

                {/* 3. Active Users */}
                <div className="md:col-span-1">
                    <StatCard 
                        title="Active Sessions" 
                        value={stats.activeUsers} 
                        subtext="Currently Online"
                        accentColor="text-emerald-400"
                        icon={<svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>}
                    />
                </div>

            </div>

            {/* Quick Actions Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <button className="p-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl text-white font-bold text-left hover:scale-[1.02] transition-transform shadow-lg shadow-cyan-900/20">
                    + Add New Product
                </button>
                <button className="p-4 bg-[#161b2c] border border-slate-700 rounded-2xl text-slate-300 font-bold text-left hover:bg-slate-800 transition-colors">
                    View Audit Logs
                </button>
                <button className="p-4 bg-[#161b2c] border border-slate-700 rounded-2xl text-slate-300 font-bold text-left hover:bg-slate-800 transition-colors">
                    Manage API Keys
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;