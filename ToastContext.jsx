import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'info', duration = 4500) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toast Overlay Container */}
      <div 
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full px-4 sm:px-0 pointer-events-none"
        aria-live="polite"
        role="region"
        aria-label="Notifications"
      >
        {toasts.map(toast => {
          let bg = 'bg-white border-dark-border text-dark-text';
          let Icon = Info;
          let iconColor = 'text-brand-600';

          if (toast.type === 'success') {
            bg = 'bg-[#F0FDF4] border-brand-200 text-brand-950';
            Icon = CheckCircle2;
            iconColor = 'text-brand-700';
          } else if (toast.type === 'error') {
            bg = 'bg-red-50 border-red-200 text-red-950';
            Icon = AlertCircle;
            iconColor = 'text-red-600';
          } else if (toast.type === 'warning') {
            bg = 'bg-amber-50 border-amber-200 text-amber-950';
            Icon = AlertTriangle;
            iconColor = 'text-amber-600';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-soft border ${bg} transition-all duration-300 animate-in fade-in slide-in-from-bottom-2`}
              role="alert"
            >
              <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconColor}`} />
              <div className="flex-1 text-sm font-medium leading-relaxed">
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-gray-700 transition p-0.5 rounded-md"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
