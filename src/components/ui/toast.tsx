import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Info } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info';
}

interface ToastContextType {
  show: (message: string, type?: 'success' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string, type: 'success' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss after 2.5s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      
      {/* Toast Portal Container */}
      <div className="fixed bottom-20 md:bottom-6 right-6 z-50 flex flex-col space-y-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto flex items-center space-x-3 px-5 py-3.5 bg-[#0c0c14] border border-white/15 text-white rounded-full min-w-[220px] max-w-md justify-between shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md"
            >
              <div className="flex items-center space-x-3">
                {toast.type === 'success' ? (
                  <div className="bg-emerald-500/10 text-emerald-400 p-1.5 rounded-full border border-emerald-500/20 flex-shrink-0">
                    <Check size={14} className="stroke-[3px]" />
                  </div>
                ) : (
                  <div className="bg-[#ff7759]/10 text-[#ff7759] p-1.5 rounded-full border border-[#ff7759]/20 flex-shrink-0">
                    <Info size={14} />
                  </div>
                )}
                <span className="text-xs font-semibold">{toast.message}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
