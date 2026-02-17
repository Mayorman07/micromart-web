import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OperativesList = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    
    // 📊 Pagination state matches Spring Data Page structure
    const [pagination, setPagination] = useState({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        pageSize: 15
    });

    const fetchUsers = useCallback(async (page = 0, query = "") => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            
            // 🎯 Calling your verified backend endpoint
            const response = await axios.get(`http://127.0.0.1:7082/users/users/all`, {
                params: {
                    page: page,
                    size: pagination.pageSize,
                    keyword: query
                },
                headers: { 
                    Authorization: `Bearer ${token}` 
                }
            });

            // 🛠️ Destructure the 'content' array from the Spring Page object
            const { content, totalPages, totalElements, number } = response.data;
            
            setUsers(content || []);
            setPagination(prev => ({
                ...prev,
                currentPage: number,
                totalPages: totalPages,
                totalElements: totalElements
            }));
        } catch (error) {
            console.error("Registry Sync Failed:", error);
            // Handle 401/403 by redirecting to login if token is invalid
            if (error.response?.status === 401 || error.response?.status === 403) {
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    }, [pagination.pageSize, navigate]);

    // 🕵️‍♂️ Debounce Logic: Wait 500ms after user stops typing to fire API call
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchUsers(0, searchTerm);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, fetchUsers]);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 pb-20">
            {/* TOP BAR */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Operative Registry</h1>
                    <p className="text-slate-500 text-sm mt-2">Manage personnel clearance and identity.</p>
                </div>
                
                {/* SEARCH INPUT */}
                <div className="relative w-80">
                    <input 
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full bg-[#161b2c] border border-white/10 rounded-2xl py-3.5 px-5 text-sm text-white focus:border-cyan-500 outline-none transition-all placeholder:text-slate-600 shadow-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute right-4 top-4 text-slate-600">
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        )}
                    </div>
                </div>
            </div>

            {/* TABLE CONTAINER */}
            <div className="bg-[#161b2c] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/5">
                            <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Operative</th>
                            <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Identity</th>
                            <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                            <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Last Active</th>
                            <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.userId} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-black font-bold text-xs">
                                                {user.firstName[0]}{user.lastName[0]}
                                            </div>
                                            <span className="text-white font-bold">{user.firstName} {user.lastName}</span>
                                        </div>
                                    </td>
                                    <td className="p-6 text-slate-400 text-sm font-medium">{user.email}</td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-tighter uppercase ${
                                            user.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                                        }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="p-6 text-slate-500 text-xs font-mono">
                                        {user.lastLoggedIn ? new Date(user.lastLoggedIn).toLocaleDateString() : 'NEVER'}
                                    </td>
                                    <td className="p-6">
                                        <button 
                                            onClick={() => navigate(`/admin/view/${user.email}`)}
                                            className="text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all"
                                        >
                                            View Dossier
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="p-20 text-center text-slate-500 font-medium italic">
                                    {loading ? "Decrypting registry data..." : "No operatives found in this sector."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            <div className="flex justify-between items-center px-4">
                <p className="text-slate-500 text-xs font-medium">
                    Showing <span className="text-white">{users.length}</span> of {pagination.totalElements} Operatives
                </p>
                <div className="flex gap-2">
                    <button 
                        disabled={pagination.currentPage === 0}
                        onClick={() => fetchUsers(pagination.currentPage - 1, searchTerm)}
                        className="p-3 rounded-xl bg-[#161b2c] border border-white/5 text-white disabled:opacity-20 hover:bg-white/5 transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
                    </button>
                    <button 
                        disabled={pagination.currentPage + 1 >= pagination.totalPages}
                        onClick={() => fetchUsers(pagination.currentPage + 1, searchTerm)}
                        className="p-3 rounded-xl bg-[#161b2c] border border-white/5 text-white disabled:opacity-20 hover:bg-white/5 transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OperativesList;