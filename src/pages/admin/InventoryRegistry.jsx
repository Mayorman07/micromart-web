import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const InventoryRegistry = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [pagination, setPagination] = useState({
        currentPage: 0,
        totalPages: 0,
        pageSize: 15
    });

    // 🎯 FETCH INVENTORY DATA
    const fetchProducts = useCallback(async (page = 0, query = "") => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`http://127.0.0.1:7082/inventory/api/inventory/all`, {
                params: { page, size: pagination.pageSize, keyword: query },
                headers: { Authorization: `Bearer ${token}` }
            });

            const { content, totalPages, number } = response.data;
            setProducts(content || []);
            setPagination(prev => ({
                ...prev,
                currentPage: number,
                totalPages: totalPages
            }));
        } catch (error) {
            console.error("Inventory Sync Failed:", error);
        } finally {
            setLoading(false);
        }
    }, [pagination.pageSize]);

    // 🚀 FIXED: ADD STOCK LOGIC
    const handleAddStock = async (skuCode, currentQuantity) => {
        const amountToAdd = prompt(`Current stock for SKU ${skuCode} is ${currentQuantity}. How many units are you adding?`, "0");
        
        // Validation: Don't send if canceled, not a number, or zero
        if (amountToAdd === null || isNaN(amountToAdd) || parseInt(amountToAdd) === 0) return;

        try {
            const token = localStorage.getItem("token");
            await axios.put(`http://127.0.0.1:7082/inventory/api/inventory/add`, {
                skuCode: skuCode, // 🎯 Matches the Java InventoryRequest field name
                quantity: parseInt(amountToAdd)
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // 💫 Refresh the list to show the new total immediately
            fetchProducts(pagination.currentPage, searchTerm);
        } catch (error) {
            console.error("Update failed:", error.response?.data);
            alert(`Error: ${error.response?.data?.message || "Failed to add stock."}`);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchProducts(0, searchTerm);
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, fetchProducts]);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 pb-20">
            <div className="flex justify-between items-end px-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Inventory Registry</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium italic">Stock distribution & SKU synchronization.</p>
                </div>
                <div className="relative w-72">
                    <input 
                        type="text"
                        placeholder="Search SKU..."
                        className="w-full bg-[#161b2c] border border-white/10 rounded-2xl py-3 px-5 text-sm text-white focus:border-cyan-500 outline-none transition-all shadow-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-[#161b2c] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <th className="p-6">Product Details</th>
                            <th className="p-6 text-center">SKU Code</th>
                            <th className="p-6 text-center">Price</th>
                            <th className="p-6 text-center">Current Stock</th>
                            <th className="p-6 text-right">Operation</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {products.length > 0 ? products.map((product) => (
                            <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="p-6">
                                    <p className="text-white font-bold">{product.name}</p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-tighter font-semibold">{product.category}</p>
                                </td>
                                <td className="p-6 text-cyan-500 font-mono text-xs text-center">{product.skuCode}</td>
                                <td className="p-6 text-white font-medium text-center">${product.price}</td>
                                <td className="p-6 text-center">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${product.quantity > 10 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                        {product.quantity} UNITS
                                    </span>
                                </td>
                                <td className="p-6 text-right">
                                    <button 
                                        onClick={() => handleAddStock(product.skuCode, product.quantity)}
                                        className="text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-widest transition-colors border border-white/5 px-4 py-2 rounded-xl hover:bg-white/5"
                                    >
                                        Edit SKU
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="p-20 text-center text-slate-500 italic">
                                    {loading ? "Accessing central inventory core..." : "No inventory data found."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InventoryRegistry;