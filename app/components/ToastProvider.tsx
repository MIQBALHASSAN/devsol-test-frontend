'use client';
import React, { createContext, useContext, useRef } from 'react';
import { Toast } from 'primereact/toast';

type ToastType = 'success' | 'info' | 'warn' | 'error';

const ToastContext = createContext<React.RefObject<Toast | null> | null>(null);

export const useGlobalToast = () => {
    const toastRef = useContext(ToastContext);
    if (!toastRef) {
        throw new Error('useGlobalToast must be used within a ToastProvider');
    }
    return toastRef.current;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const toastRef = useRef<Toast>(null);

    // Attach global toast function to window
    if (typeof window !== 'undefined') {
        window.toast = (type: ToastType, summary: string, message: string) => {
            if (toastRef.current) {
                toastRef.current.show({
                    severity: type,
                    summary,
                    detail: message,
                    life: 3000
                });
            }
        };
    }

    return (
        <ToastContext.Provider value={toastRef}>
            <Toast ref={toastRef} />
            {children}
        </ToastContext.Provider>
    );
};
