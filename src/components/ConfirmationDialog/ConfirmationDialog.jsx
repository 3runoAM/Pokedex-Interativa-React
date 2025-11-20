export default function ConfirmationDialog({message, onConfirm, onCancel} ){
    return (
        <aside>
            <p>{message}</p>
            <button onClick={onConfirm}>Confirm</button>
            <button onClick={onCancel}>Cancel</button>
        </aside>
    );
}