import { useState, useEffect } from "react";
import api from "../../services/api"; 

/**
 * InventoryDashboard Component
 * Provides a high-level overview of system assets with real-time search functionality.
 * Interfaces with the Inventory microservice via the centralized security interceptor.
 */
const InventoryDashboard = () => {
    const [inventory, setInventory] = useState([]);
    const [filteredInventory, setFilteredInventory] = useState([]); 
    const [searchTerm, setSearchTerm] = useState(""); 
    const [loading, setLoading] = useState(true);

    /**
     * Fetches all inventory items from the service registry.
     * Standardizes the backend data structure into a consistent UI View Model.
     */
    const fetchInventory = async () => {
        setLoading(true);
        try {
            /** * The 'Authorization' header is now automatically handled by the 
             * api.interceptors.request in api.js.
             */
            const response = await api.get("/inventory/api/inventory/all");

            // Extracting the content array from the Spring Data Page envelope
            const items = response.data.content || [];

            /** * Internal Mapping: Standardizing API response to UI model.
             * Specifically maps backend 'quantity' to 'stockQuantity' for UI progress bars.
             */
            const standardizedItems = items.map((item, index) => ({
                id: index, 
                name: item.name,
                skuCode: item.skuCode,
                categoryName: item.category, 
                price: item.price,
                stockQuantity: item.quantity, 
                imageUrl: item.imageUrl || `https://placehold.co/400x400/2c3e50/white?text=${item.skuCode}`,
                inStock: item.inStock
            }));

            setInventory(standardizedItems);
            setFilteredInventory(standardizedItems); 
        } catch (err) {
            console.error("Registry Sync Error: Unable to retrieve inventory data", err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Effect Hook: Handles client-side filtering logic.
     * Monitors changes in searchTerm and inventory state to update the view.
     */
    useEffect(() => {
        const results = inventory.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.skuCode.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredInventory(results);
    }, [searchTerm, inventory]);

    useEffect(() => {
        fetchInventory();
    }, []);

    const labelStyle = "p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest";

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-700">
            {/* Control Header: Asset Summary and Search */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex gap-6 w-full max-w-2xl">
                    <div className="bg-[#161b2c] p-6 rounded-[2rem] border border-white/5 shadow-2xl flex-1">
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1">Active Registry</p>
                        <h2 className="text-3xl font-black text-white">{filteredInventory.length} <span className="text-xs text-slate-500">MATCHES</span></h2>
                    </div>
                </div>

                <div className="relative w-full md:w-96 group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input 
                        type="text"
                        placeholder="SEARCH BY NAME OR SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#161b2c] border border-white/5 p-5 pl-12 rounded-[1.5rem] text-white text-[10px] font-black tracking-widest outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-2xl"
                    />
                </div>
            </div>

            {/* Inventory Data Table */}
            <div className="bg-[#161b2c] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white/5 border-b border-white/5">
                            <tr>
                                <th className={labelStyle}>Product Details</th>
                                <th className={labelStyle}>SKU Identifier</th>
                                <th className={labelStyle}>Classification</th>
                                <th className={labelStyle}>Market Value</th>
                                <th className={labelStyle}>Current Stock</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredInventory.length === 0 && !loading ? (
                                <tr>
                                    <td colSpan="5" className="p-20 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">
                                        No assets matching "{searchTerm}"
                                    </td>
                                </tr>
                            ) : (
                                filteredInventory.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-6 flex items-center gap-4">
                                            <div className="relative">
                                                <img src={item.imageUrl} className="w-12 h-12 rounded-2xl object-cover bg-slate-800 border border-white/5" alt="" />
                                                <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-[#161b2c] ${item.stockQuantity > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{item.name}</p>
                                                <p className="text-[9px] text-slate-500 font-mono tracking-tighter uppercase">Registry Verified</p>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className="font-mono text-[10px] text-blue-400 font-bold bg-blue-500/5 px-3 py-1.5 rounded-lg border border-blue-500/10 uppercase">
                                                {item.skuCode}
                                            </span>
                                        </td>
                                        <td className="p-6 text-[9px] font-black text-slate-400 uppercase">
                                            {item.categoryName}
                                        </td>
                                        <td className="p-6 text-white font-black text-lg">
                                            <span className="text-slate-500 text-xs mr-1">$</span>
                                            {item.price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="p-6">
                                            <div className="flex flex-col gap-1">
                                                <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase w-fit ${item.stockQuantity > 10 ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/10' : 'bg-red-500/10 text-red-500 border border-red-500/10'}`}>
                                                    {item.stockQuantity} UNITS
                                                </span>
                                                <div className="w-24 bg-slate-800 h-1 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full transition-all duration-1000 ${item.stockQuantity > 10 ? 'bg-emerald-500' : 'bg-red-500'}`}
                                                        style={{ width: `${Math.min((item.stockQuantity / 100) * 100, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InventoryDashboard;