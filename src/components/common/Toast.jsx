import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="text-emerald-600" size={24} />,
    error: <XCircle className="text-rose-600" size={24} />,
    warning: <AlertCircle className="text-amber-600" size={24} />,
    info: <AlertCircle className="text-violet-600" size={24} />
  };

  const bgColors = {
    success: 'bg-emerald-50 border-emerald-200',
    error: 'bg-rose-50 border-rose-200',
    warning: 'bg-amber-50 border-amber-200',
    info: 'bg-violet-50 border-violet-200'
  };

  return (
    <div className={`fixed top-20 right-6 z-50 animate-slide-in-right`}>
      <div className={`${bgColors[type]} border-2 rounded-2xl p-4 shadow-xl flex items-center gap-3 min-w-[300px] max-w-md`}>
        {icons[type]}
        <p className="flex-1 font-medium text-slate-900">{message}</p>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-20 right-6 z-50 space-y-3">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
          duration={toast.duration}
        />
      ))}
    </div>
  );
};

export default Toast;
