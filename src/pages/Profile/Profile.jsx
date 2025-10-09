import style from './Profile.module.css';
import Authentication from "../../services/Authentication";
import {useNavigate} from "react-router-dom";

export default function Profile() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await Authentication.logOut();
        localStorage.clear();
        navigate('/login');
    };

    return (
        <section className={`flex-column largeGap`}>
            <h1>Profile Page</h1>

            <button className={`${style.logOut} button`} onClick={handleLogout}>SAIR</button>
        </section>
    );
}