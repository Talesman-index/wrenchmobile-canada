'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Wrench,
  X,
  Bell,
  Sparkles,
  MapPin,
  Car,
  Check,
} from 'lucide-react';

export type ToastType = 'info' | 'success' | 'warning' | 'error' | 'wrench' | 'location' | 'car';

export interface ToastOptions {
  title?: string;
  message: string;
  type?: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ConfirmModalOptions {
  title: string;
  message: string;
  type?: 'info' | 'warning' | 'danger' | 'success';
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

interface ToastItem extends ToastOptions {
  id: string;
  createdAt: number;
}

interface ToastContextType {
  toast: (options: ToastOptions | string) => void;
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showWrench: (message: string, title?: string) => void;
  confirmModal: (options: ConfirmModalOptions) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Standalone global trigger helper for cases outside React hook tree
let globalToastHandler: ToastContextType | null = null;

export const notify = {
  toast: (opts: ToastOptions | string) => globalToastHandler?.toast(opts),
  success: (msg: string, title?: string) => globalToastHandler?.showSuccess(msg, title),
  error: (msg: string, title?: string) => globalToastHandler?.showError(msg, title),
  info: (msg: string, title?: string) => globalToastHandler?.showInfo(msg, title),
  warning: (msg: string, title?: string) => globalToastHandler?.showWarning(msg, title),
  wrench: (msg: string, title?: string) => globalToastHandler?.showWrench(msg, title),
  confirm: (opts: ConfirmModalOptions) => globalToastHandler?.confirmModal(opts),
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [activeModal, setActiveModal] = useState<ConfirmModalOptions | null>(null);
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (options: ToastOptions | string) => {
      const opts: ToastOptions =
        typeof options === 'string' ? { message: options, type: 'info' } : options;
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const newToast: ToastItem = {
        id,
        title: opts.title,
        message: opts.message,
        type: opts.type || 'info',
        duration: opts.duration ?? 4500,
        action: opts.action,
        createdAt: Date.now(),
      };

      setToasts((prev) => [newToast, ...prev].slice(0, 4)); // Max 4 toasts
    },
    []
  );

  const showSuccess = useCallback((message: string, title = 'Succès') => {
    toast({ message, title, type: 'success' });
  }, [toast]);

  const showError = useCallback((message: string, title = 'Erreur') => {
    toast({ message, title, type: 'error' });
  }, [toast]);

  const showInfo = useCallback((message: string, title = 'Information') => {
    toast({ message, title, type: 'info' });
  }, [toast]);

  const showWarning = useCallback((message: string, title = 'Attention') => {
    toast({ message, title, type: 'warning' });
  }, [toast]);

  const showWrench = useCallback((message: string, title = 'MécanoMobile') => {
    toast({ message, title, type: 'wrench' });
  }, [toast]);

  const confirmModal = useCallback((options: ConfirmModalOptions) => {
    setActiveModal(options);
  }, []);

  // Set global handler
  useEffect(() => {
    globalToastHandler = {
      toast,
      showSuccess,
      showError,
      showInfo,
      showWarning,
      showWrench,
      confirmModal,
      dismissToast,
    };
  }, [toast, showSuccess, showError, showInfo, showWarning, showWrench, confirmModal, dismissToast]);

  const handleConfirmAction = async () => {
    if (!activeModal) return;
    try {
      setIsConfirmLoading(true);
      await activeModal.onConfirm();
      setActiveModal(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsConfirmLoading(false);
    }
  };

  const handleCancelAction = () => {
    if (activeModal?.onCancel) {
      activeModal.onCancel();
    }
    setActiveModal(null);
  };

  return (
    <ToastContext.Provider
      value={{
        toast,
        showSuccess,
        showError,
        showInfo,
        showWarning,
        showWrench,
        confirmModal,
        dismissToast,
      }}
    >
      {children}

      {/* Floating Toast Notification Container (Top Center) */}
      <aside
        aria-label="Notifications"
        className="fixed top-4 left-0 right-0 z-[9999] pointer-events-none flex flex-col items-center gap-2.5 px-4 max-w-md mx-auto"
      >
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} onDismiss={() => dismissToast(t.id)} />
        ))}
      </aside>

      {/* Modern Confirmation Modal Dialog */}
      {activeModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          {/* Backdrop with blur */}
          <div
            className="fixed inset-0 bg-[#0b1b32]/70 backdrop-blur-md transition-opacity animate-fade-in"
            onClick={handleCancelAction}
          />

          {/* Dialog Card */}
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-sm rounded-[28px] bg-white p-6 shadow-2xl ring-1 ring-black/5 animate-scale-up z-10 overflow-hidden"
          >
            {/* Top Accent Gradient Bar */}
            <div
              className={`absolute top-0 left-0 right-0 h-1.5 ${
                activeModal.type === 'danger'
                  ? 'bg-rose-500'
                  : activeModal.type === 'warning'
                  ? 'bg-amber-500'
                  : activeModal.type === 'success'
                  ? 'bg-emerald-500'
                  : 'bg-[#facc15]'
              }`}
            />

            <div className="flex flex-col items-center text-center">
              {/* Icon Badge */}
              <div
                className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${
                  activeModal.type === 'danger'
                    ? 'bg-rose-100 text-rose-600 shadow-rose-200/50'
                    : activeModal.type === 'warning'
                    ? 'bg-amber-100 text-amber-600 shadow-amber-200/50'
                    : activeModal.type === 'success'
                    ? 'bg-emerald-100 text-emerald-600 shadow-emerald-200/50'
                    : 'bg-amber-100 text-amber-600 shadow-amber-200/50'
                } shadow-lg`}
              >
                {activeModal.type === 'danger' ? (
                  <AlertTriangle className="h-7 w-7 stroke-[2.2]" />
                ) : activeModal.type === 'warning' ? (
                  <AlertTriangle className="h-7 w-7 stroke-[2.2]" />
                ) : activeModal.type === 'success' ? (
                  <CheckCircle2 className="h-7 w-7 stroke-[2.2]" />
                ) : (
                  <Info className="h-7 w-7 stroke-[2.2]" />
                )}
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-bold text-[#0b1b32] tracking-tight mb-2">
                {activeModal.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6 font-medium">
                {activeModal.message}
              </p>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  type="button"
                  onClick={handleCancelAction}
                  disabled={isConfirmLoading}
                  className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all active:scale-[0.98]"
                >
                  {activeModal.cancelText || 'Annuler'}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAction}
                  disabled={isConfirmLoading}
                  className={`w-full py-3 px-4 rounded-2xl font-bold text-sm text-white shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                    activeModal.type === 'danger'
                      ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/30'
                      : activeModal.type === 'warning'
                      ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/30'
                      : 'bg-[#0b1b32] hover:bg-[#132a4a] shadow-[#0b1b32]/30'
                  }`}
                >
                  {isConfirmLoading ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    activeModal.confirmText || 'Confirmer'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

function ToastCard({ toast, onDismiss }: { toast: ToastItem; onDismiss: () => void }) {
  useEffect(() => {
    if (!toast.duration || toast.duration <= 0) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, toast.duration);
    return () => clearTimeout(timer);
  }, [toast.duration, onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-rose-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />;
      case 'wrench':
        return <Wrench className="h-5 w-5 text-[#facc15] shrink-0 animate-pulse" />;
      case 'location':
        return <MapPin className="h-5 w-5 text-sky-400 shrink-0" />;
      case 'car':
        return <Car className="h-5 w-5 text-[#facc15] shrink-0" />;
      case 'info':
      default:
        return <Bell className="h-5 w-5 text-[#facc15] shrink-0" />;
    }
  };

  const getBadgeStyle = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
      case 'error':
        return 'bg-rose-500/20 text-rose-300 border border-rose-500/30';
      case 'warning':
        return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
      case 'wrench':
      case 'car':
        return 'bg-amber-400/20 text-amber-300 border border-amber-400/30';
      default:
        return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
    }
  };

  return (
    <div
      role="alert"
      className="pointer-events-auto w-full group relative overflow-hidden rounded-2xl bg-[#0b1b32]/95 text-white p-4 shadow-2xl backdrop-blur-xl border border-white/10 ring-1 ring-black/10 transition-all hover:scale-[1.01] animate-slide-down"
    >
      {/* Background Subtle Radial Glow */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />

      <div className="flex items-start gap-3.5 relative z-10">
        <div className={`p-2 rounded-xl shrink-0 ${getBadgeStyle()}`}>
          {getIcon()}
        </div>

        <div className="flex-1 min-w-0 pr-2">
          {toast.title && (
            <div className="flex items-center gap-1.5 mb-0.5">
              <h4 className="text-sm font-bold text-white tracking-tight">{toast.title}</h4>
            </div>
          )}
          <p className="text-xs font-normal text-slate-300 leading-relaxed break-words">
            {toast.message}
          </p>

          {toast.action && (
            <button
              onClick={() => {
                toast.action?.onClick();
                onDismiss();
              }}
              className="mt-2.5 inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#facc15] hover:bg-[#eab308] text-[#0b1b32] text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              {toast.action.label}
            </button>
          )}
        </div>

        <button
          onClick={onDismiss}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Animated auto-dismiss countdown bar */}
      {toast.duration && toast.duration > 0 && (
        <div
          className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 overflow-hidden"
        >
          <div
            className="h-full bg-gradient-to-r from-[#facc15] to-amber-500 animate-toast-progress"
            style={{ animationDuration: `${toast.duration}ms` }}
          />
        </div>
      )}
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast doit être utilisé au sein d’un ToastProvider');
  }
  return context;
}
