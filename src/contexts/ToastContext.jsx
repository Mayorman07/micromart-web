import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = "success") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3500);
    }, []);

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            
            {/* Tactical Toast Container */}
            <div className="fixed bottom-10 right-10 z-[200] flex flex-col gap-4 pointer-events-none">
                {toasts.map((toast) => (
                    <div 
                        key={toast.id} 
                        className={`
                            pointer-events-auto flex items-center justify-between gap-8 min-w-[320px] 
                            px-6 py-4 border-l-4 backdrop-blur-2xl shadow-2xl transition-all duration-500
                            animate-in slide-in-from-right-10 fade-in
                            ${toast.type === 'success' 
                                ? 'bg-slate-950/90 border-cyan-500 text-white' 
                                : 'bg-red-950/90 border-red-500 text-white'
                            }
                        `}
                    >
                        <div className="flex flex-col gap-1">
                            {/* Meta-header for tactical feel */}
                            <span className="text-[8px] font-black uppercase tracking-[0.4em] opacity-40">
                                {toast.type === 'success' ? 'Registry Update' : 'System Alert'}
                            </span>
                            <span className="text-[11px] font-bold uppercase tracking-widest font-mono">
                                {toast.message}
                            </span>
                        </div>

                        {/* Status Pulse Indicator */}
                        <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${
                            toast.type === 'success' ? 'bg-cyan-500' : 'bg-red-500'
                        }`} />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};