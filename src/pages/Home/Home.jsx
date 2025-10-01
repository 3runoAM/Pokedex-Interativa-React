import styles from './Home.module.css';
import Authentication from "../../services/Authentication";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await Authentication.logOut();
        localStorage.clear()
        navigate('/login');
    };

    return (
        <>
            <h1>Home</h1>
            <button className={`${styles.button} button`} onClick={handleLogout}>SAIR</button>
        </>
    );
}