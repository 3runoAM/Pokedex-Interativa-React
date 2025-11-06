import React, {createContext, useContext, useRef, useState} from 'react';
import Toast from '../components/Toast/Toast';

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [message, setMessage] = useState('');
    const [visible, setVisible] = useState(false);
    const timerRef = useRef(null);
    const DURATION = 3000;

    const showToast = (msg) => {
        if (!msg) return;
        setMessage(msg);
        setVisible(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setVisible(false);
            timerRef.current = null;
        }, DURATION);
    };

    const hideToast = () => {
        setVisible(false);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            <Toast message={message} visible={visible} onClose={hideToast} />
            {children}
        </ToastContext.Provider>
    );
}

export const useToast = () => useContext(ToastContext);