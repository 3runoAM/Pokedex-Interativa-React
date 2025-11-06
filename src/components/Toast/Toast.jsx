import style from './Toast.module.css';

export default function Toast({ message, visible, onClose }) {
    if (!message || !visible) return null;

    return (
        <div className={`${style.toast} mediumPadding flex-column mediumGap`}>
            <button className={`flex-row flex-center`} onClick={onClose}>×</button>
            <p>{message}</p>
        </div>
    );
}