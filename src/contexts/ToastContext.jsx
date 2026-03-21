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

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            
            {/* 🎯 Tactical HUD Toast Container (Z-Index 200) */}
            <div className="fixed bottom-10 right-10 z-[200] flex flex-col gap-4 pointer-events-none items-end">
                {toasts.map((toast) => (
                    <div 
                        key={toast.id} 
                        className={`
                            pointer-events-auto flex items-center justify-between gap-10 min-w-[340px] 
                            px-6 py-5 border-l-4 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500
                            animate-in slide-in-from-right-10 fade-in
                            ${toast.type === 'success' 
                                ? 'bg-slate-950/90 border-cyan-500 text-white' 
                                : 'bg-red-950/90 border-red-500 text-white'
                            }
                        `}
                    >
                        <div className="flex flex-col gap-1">
                            <span className="text-[8px] font-black uppercase tracking-[0.5em] opacity-30">
                                {toast.type === 'success' ? 'Registry Synchronized' : 'System Exception'}
                            </span>
                            <span className="text-[11px] font-bold uppercase tracking-widest font-mono italic">
                                {toast.message}
                            </span>
                        </div>

                        {/* Status Pulse Indicator */}
                        <div className={`h-2 w-2 rounded-full animate-pulse ${
                            toast.type === 'success' ? 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]' : 'bg-red-500'
                        }`} />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};