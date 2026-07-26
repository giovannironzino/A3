import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-[var(--preto)] text-[var(--branco)] border border-[var(--exodo-red)] px-5 py-3.5 shadow-2xl flex items-center gap-3 animate-fade-in max-w-[420px]">
      <CheckCircle className="w-5 h-5 text-[var(--exodo-red)] shrink-0" />
      <span className="font-subtitle text-xs font-semibold leading-snug flex-1">
        {message}
      </span>
      <button
        onClick={onClose}
        className="text-[var(--cinza-medio)] hover:text-[var(--branco)] bg-transparent border-none cursor-pointer p-0.5"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
