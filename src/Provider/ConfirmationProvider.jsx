import {createContext, useContext, useRef, useState} from "react";
import ConfirmationDialog from "../components/ConfirmationDialog/ConfirmationDialog";

const ConfirmationContext = createContext();

export function ConfirmationProvider({children}) {
    const [message, setMessage] = useState('');
    const [visible, setVisible] = useState(false);
    const resolveRef = useRef(null);

    const showDialog = (msg) => {
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

    return (
        <ConfirmationContext.Provider value={{showDialog}}>
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