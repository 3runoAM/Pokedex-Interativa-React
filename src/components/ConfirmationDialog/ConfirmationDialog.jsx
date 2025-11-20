import style from './ConfirmationDialog.module.css';

export default function ConfirmationDialog({message, onConfirm, onCancel} ){
    return (
        <aside className={`${style.dialog} flex-column flex-center mediumPadding`}>
            <p>{message}</p>
            <div className={`flex-row flex-center smallPadding smallGap`}>
                <button className={`${style.confirmButton} button`} onClick={onConfirm}>Confirm</button>
                <button className={`${style.cancelButton} button`} onClick={onCancel}>Cancel</button>
            </div>
        </aside>
    );
}