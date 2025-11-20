import {createContext, useContext, useEffect, useRef, useState} from "react";
import ConfirmationDialog from "../components/ConfirmationDialog/ConfirmationDialog";
import {useLocation} from "react-router-dom";

const ConfirmationContext = createContext();

export function ConfirmationProvider({children}) {
    const [message, setMessage] = useState('');
    const [visible, setVisible] = useState(false);
    const resolveRef = useRef(null);
    const location = useLocation();

    const getConfirmation = (msg) => {
        return new Promise((resolve) => {
            setMessage(msg);
            setVisible(true);
            resolveRef.current = resolve;
        });
    };

    const handleConfirm = () => {
        setVisible(false);
        if (resolveRef.current) {
            resolveRef.current(true);
            resolveRef.current = null;
        }
    };

    const handleCancel = () => {
        setVisible(false);
        if (resolveRef.current) {
            resolveRef.current(false);
            resolveRef.current = null;
        }
    };

    useEffect(() => {
        return () => {
            setVisible(false)
            if (resolveRef.current) {
                resolveRef.current(false);
                resolveRef.current = null;
            }
        }
    }, [location])

    return (
        <ConfirmationContext.Provider value={{getConfirmation}}>
            {
                visible && (
                    <ConfirmationDialog message={message}
                                        onConfirm={handleConfirm}
                                        onCancel={handleCancel}/>
                )
            }
            {children}
        </ConfirmationContext.Provider>
    );
}

export const useConfirmation = () => useContext(ConfirmationContext);