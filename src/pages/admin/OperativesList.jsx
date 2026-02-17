import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OperativesList = () => {
    const navigate = useNavigate();
    
    // --- State Management ---
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        pageSize: 15
    });

    // --- Data Fetching ---
    const fetchUsers = useCallback(async (page = 0) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            // Hits your @GetMapping(path = "/all") with Pageable
            const response = await axios.get(`http://127.0.0.1:7082/users/users/all?page=${page}&size=${pagination.pageSize}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Spring Page object structure: data is in .content
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
        } finally {
            setLoading(false);
        }
    }, [pagination.pageSize]);

    useEffect(() => {
        fetchUsers(0);
    }, [fetchUsers]);

    // --- Component Styling ---
    const tableHeaderClass = "p-6 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] border-b border-white/5";
    const tableCellClass = "p-6 text-sm border-b border-white/5";

    return (
        <div className="animate-[fadeIn_0.5s_ease-out] space-y-8 pb-20">
            
            {/* 1. HEADER SECTION */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Operative Registry</h1>
                    <p className="text-slate-500 text-sm mt-2 font-medium">
                        Displaying {users.length} operatives in current sector.
                    </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-mono text-cyan-500 font-bold uppercase tracking-widest">
                        Total Database: {pagination.totalElements}
                    </span>
                    <div className="h-1 w-32 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500 animate-pulse" style={{ width: '100%' }}></div>
                    </div>
                </div>
            </div>

            {/* 2. MAIN BENTO TABLE */}
            <div className="bg-[#161b2c] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                {loading && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-20 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                            <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase">Syncing...</span>
                        </div>
                    </div>
                )}

                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/[0.02]">
                            <th className={tableHeaderClass}>Operative</th>
                            <th className={tableHeaderClass}>Security Email</th>
                            <th className={tableHeaderClass}>Tier</th>
                            <th className={tableHeaderClass}>Status</th>
                            <th className="p-6 border-b border-white/5"></th>
                        </tr>
                    </thead>
                    <tbody className="relative min-h-[400px]">
                        {users.map((user) => (
                            <tr key={user.userId} className="group hover:bg-white/[0.01] transition-all duration-200">
                                <td className={tableCellClass}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-xs font-black text-white shadow-inner">
                                            {user.firstName?.[0]}{user.lastName?.[0]}
                                        </div>
                                        <div>
                                            <p className="text-white font-bold tracking-tight">{user.firstName} {user.lastName}</p>
                                            <p className="text-[10px] text-slate-600 font-mono lowercase">ID_{user.userId?.substring(0, 8)}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className={`${tableCellClass} text-slate-400 font-medium`}>
                                    {user.email}
                                </td>
                                <td className={tableCellClass}>
                                    <div className="flex gap-2">
                                        {user.roles?.map(role => (
                                            <span key={role} className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg text-[9px] font-black uppercase tracking-tighter">
                                                {role.replace('ROLE_', '')}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className={tableCellClass}>
                                    <span className="flex items-center gap-2 text-[10px] font-bold text-emerald-400">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        ACTIVE
                                    </span>
                                </td>
                                <td className="p-6 text-right border-b border-white/5">
                                    <button 
                                        onClick={() => navigate(`/admin/view/${user.email}`)}
                                        className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black transition-all border border-white/10"
                                    >
                                        OPEN_DOSSIER
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 3. PAGINATION NAVIGATOR */}
            <div className="flex items-center justify-between px-4">
                <div className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">
                    Sector {pagination.currentPage + 1} of {pagination.totalPages}
                </div>
                
                <div className="flex gap-3">
                    <button 
                        disabled={pagination.currentPage === 0 || loading}
                        onClick={() => fetchUsers(pagination.currentPage - 1)}
                        className="px-6 py-2 bg-white/5 rounded-xl border border-white/10 text-xs font-bold text-white hover:bg-white/10 disabled:opacity-20 transition-all active:scale-95"
                    >
                        PREV
                    </button>
                    <button 
                        disabled={pagination.currentPage + 1 >= pagination.totalPages || loading}
                        onClick={() => fetchUsers(pagination.currentPage + 1)}
                        className="px-6 py-2 bg-cyan-600/20 rounded-xl border border-cyan-500/30 text-xs font-bold text-cyan-400 hover:bg-cyan-600/30 disabled:opacity-20 transition-all active:scale-95"
                    >
                        NEXT
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OperativesList;