import style from './Toast.module.css';

export default function Toast({ message, visible, onClose }) {
    if (!message || !visible) return null;

    return (
        <div className={`${style.toast} flex-row flex-center mediumPadding smallGap`}>
            <p>{message}</p>
            <button className={`flex-row flex-center`} onClick={onClose}>×</button>
        </div>
    );
}