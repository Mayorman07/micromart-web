/**
 * Orders Component
 * Displays the purchase history for the authenticated user.
 */
const Orders = () => {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 border border-white/10">
                <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Order History</h1>
            <p className="text-slate-500 font-medium text-center max-w-sm">
                You haven't placed any orders yet. Once you make a purchase from the marketplace, it will appear here.
            </p>
            <button 
                onClick={() => window.location.href = '/marketplace'}
                className="mt-8 px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-cyan-500/20"
            >
                Start Shopping
            </button>
        </div>
    );
};

export default Orders;