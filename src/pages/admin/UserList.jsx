import { useEffect, useState, useCallback } from "react";
import api from "../../services/api"; 
import { useNavigate } from "react-router-dom";
import TableSkeleton from "../../components/TableSkeleton";

/**
 * UserList Component
 * Displays a paginated list of registered users with search capabilities.
 * Interfaces with the Spring Boot user service via the centralized security interceptor.
 */
const UserList = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    
    const [pagination, setPagination] = useState({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        pageSize: 15
    });

    /**
     * Fetches paginated user data from the backend.
     * The Bearer token and baseURL are handled automatically by the api instance.
     */
    const fetchUsers = useCallback(async (page = 0, query = "") => {
        setLoading(true);
        try {
            /** * Targets Spring Boot @GetMapping(path ="/all").
             * Headers are injected globally by the api service.
             */
            const response = await api.get(`/users/users/all`, {
                params: {
                    page: page,
                    size: pagination.pageSize,
                    keyword: query
                }
            });

            // Extracting Spring Data Pageable metadata
            const { content, totalPages, totalElements, number } = response.data;
            
            setUsers(content || []);
            setPagination(prev => ({
                ...prev,
                currentPage: number,
                totalPages: totalPages,
                totalElements: totalElements
            }));
        } catch (error) {
            console.error("Fetch Error: Failed to retrieve user list", error);
            /** * Interceptor handles 401/403 errors by attempting a token refresh. 
             * If the refresh fails, the interceptor clears storage and redirects to login.
             */
        } finally {
            setLoading(false);
        }
    }, [pagination.pageSize]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchUsers(0, searchTerm);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, fetchUsers]);

    const headerStyle = "p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest";

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 pb-20">
            {/* Header and Search Interface */}
            <div className="flex justify-between items-end px-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase">User Management</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage user accounts and access permissions.</p>
                </div>
                
                <div className="relative w-80 group">
                    <input 
                        type="text"
                        placeholder="SEARCH BY NAME OR EMAIL..."
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

            {/* Operatives Registry Table */}
            <div className="bg-[#161b2c] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5">
                                <th className={headerStyle}>User Details</th>
                                <th className={headerStyle}>Email</th>
                                <th className={`${headerStyle} text-center`}>Status</th>
                                <th className={`${headerStyle} text-center`}>Last Activity</th>
                                <th className={`${headerStyle} text-right`}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {/* Render the Skeleton if data is fetching */}
                            {loading ? (
                                <TableSkeleton rows={5} columns={5} />
                            ) : users.length > 0 ? (
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
                                        <td className="p-6 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                                user.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                                            }`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="p-6 text-slate-500 text-xs font-mono text-center">
                                            {user.lastLoggedIn ? new Date(user.lastLoggedIn).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="p-6 text-right">
                                            <button 
                                                onClick={() => navigate(`/admin/view/${user.email}`)}
                                                className="text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all"
                                            >
                                                View Details
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

            {/* Pagination Controls */}
            <div className="flex justify-between items-center px-6">
                <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">
                    Displaying <span className="text-white">{users.length}</span> of {pagination.totalElements} Operatives
                </p>
                <div className="flex gap-2">
                    <button 
                        disabled={pagination.currentPage === 0 || loading}
                        onClick={() => fetchUsers(pagination.currentPage - 1, searchTerm)}
                        className="p-3 rounded-xl bg-[#161b2c] border border-white/5 text-white disabled:opacity-20 hover:bg-white/5 transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    <button 
                        disabled={pagination.currentPage + 1 >= pagination.totalPages || loading}
                        onClick={() => fetchUsers(pagination.currentPage + 1, searchTerm)}
                        className="p-3 rounded-xl bg-[#161b2c] border border-white/5 text-white disabled:opacity-20 hover:bg-white/5 transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserList;