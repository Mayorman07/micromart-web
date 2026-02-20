import { useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import TableSkeleton from "../../components/TableSkeleton"; 

/**
 * InventoryRegistry Component
 * Manages the display and stock adjustment of product SKUs.
 */
const InventoryRegistry = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [pagination, setPagination] = useState({
        currentPage: 0,
        totalPages: 0,
        pageSize: 15
    });

    const fetchProducts = useCallback(async (page = 0, query = "") => {
        setLoading(true);
        try {
            const response = await api.get(`/inventory/api/inventory/all`, {
                params: { page, size: pagination.pageSize, keyword: query }
            });

            const { content, totalPages, number } = response.data;
            setProducts(content || []);
            setPagination(prev => ({
                ...prev,
                currentPage: number,
                totalPages: totalPages
            }));
        } catch (error) {
            console.error("Data Fetch Error: Failed to retrieve inventory list", error);
        } finally {
            setLoading(false);
        }
    }, [pagination.pageSize]);

    const handleAdjustStock = async (skuCode, currentQuantity) => {
        const input = prompt(`Current stock for SKU ${skuCode} is ${currentQuantity}. Enter units to add:`, "0");
        
        const amountToAdd = parseInt(input);
        if (!input || isNaN(amountToAdd) || amountToAdd === 0) return;

        try {
            await api.put(`/inventory/api/inventory/add`, {
                skuCode: skuCode, 
                quantity: amountToAdd
            });
            fetchProducts(pagination.currentPage, searchTerm);
        } catch (error) {
            console.error("Update Error:", error.response?.data);
            alert(`Failed to update stock: ${error.response?.data?.message || "Server error"}`);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchProducts(0, searchTerm);
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, fetchProducts]);

    const headerLabelStyle = "p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest";

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 pb-20">
            <div className="flex justify-between items-end px-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Inventory Management</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium italic">Monitor and adjust stock levels across all SKUs.</p>
                </div>
                <div className="relative w-72">
                    <input 
                        type="text"
                        placeholder="Search by SKU..."
                        className="w-full bg-[#161b2c] border border-white/10 rounded-2xl py-3 px-5 text-sm text-white focus:border-cyan-500 outline-none transition-all shadow-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-[#161b2c] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5">
                                <th className={headerLabelStyle}>Product Information</th>
                                <th className={`${headerLabelStyle} text-center`}>SKU</th>
                                <th className={`${headerLabelStyle} text-center`}>Unit Price</th>
                                <th className={`${headerLabelStyle} text-center`}>In-Stock</th>
                                <th className={`${headerLabelStyle} text-right`}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {/* Render the Skeleton matching the 15-row page size */}
                            {loading ? (
                                <TableSkeleton rows={15} columns={5} />
                            ) : products.length > 0 ? (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-6">
                                            <p className="text-white font-bold">{product.name}</p>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-tighter font-semibold">{product.category}</p>
                                        </td>
                                        <td className="p-6 text-cyan-400 font-mono text-xs text-center">{product.skuCode}</td>
                                        <td className="p-6 text-white font-medium text-center">${product.price}</td>
                                        <td className="p-6 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${product.quantity > 10 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                                {product.quantity} UNITS
                                            </span>
                                        </td>
                                        <td className="p-6 text-right">
                                            <button 
                                                onClick={() => handleAdjustStock(product.skuCode, product.quantity)}
                                                className="text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-widest transition-colors border border-white/5 px-4 py-2 rounded-xl hover:bg-white/5"
                                            >
                                                Adjust Stock
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-20 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">
                                        No records found matching criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Controls with loading safeguards */}
            <div className="flex justify-between items-center px-6 mt-4">
                <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">
                    Page <span className="text-white">{pagination.currentPage + 1}</span> of {pagination.totalPages}
                </p>
                <div className="flex gap-2">
                    <button 
                        disabled={pagination.currentPage === 0 || loading}
                        onClick={() => fetchProducts(pagination.currentPage - 1, searchTerm)}
                        className="p-3 rounded-xl bg-[#161b2c] border border-white/5 text-white disabled:opacity-20 hover:bg-white/5 transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    <button 
                        disabled={pagination.currentPage + 1 >= pagination.totalPages || loading}
                        onClick={() => fetchProducts(pagination.currentPage + 1, searchTerm)}
                        className="p-3 rounded-xl bg-[#161b2c] border border-white/5 text-white disabled:opacity-20 hover:bg-white/5 transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InventoryRegistry;