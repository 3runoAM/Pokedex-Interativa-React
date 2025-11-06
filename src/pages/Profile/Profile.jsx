import style from './Profile.module.css';
import Authentication from "../../services/Authentication";
import dataBase from "../../services/DataBase";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useToast} from "../../Provider/ToastProvider";

export default function Profile() {
    const navigate = useNavigate();
    const {showToast} = useToast();

    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
    const [teams, setTeams] = useState([]);

    const handleLogout = async () => {
        try {
            await Authentication.logOut();
            localStorage.clear();
            navigate('/login');
        } catch (err) {
            showToast("Erro ao fazer logout");
            console.error("Erro ao fazer logout:", err);
        }
    };

    const getUserInfo = async () => {
        try {
            return await Authentication.getUserInfo();
        } catch (error) {
            console.error("Erro ao obter informações do usuário", error);
            showToast("Erro ao obter informações do usuário");
        }
    }

    useEffect(() => {
        const fetchUserInfo = async () => {
            const userInfo = await getUserInfo();
            setUser(userInfo);
        };

        const getUserTeams = async () => {
            try {
                const teams = await dataBase.getTeamsByUserId(user.sub);
                console.log(teams);
                setTeams(teams);
                return teams;
            } catch (error) {
                console.error("Erro ao obter times do usuário", error);
                showToast("Erro ao obter times do usuário");
            }
        }

        if (user === null) fetchUserInfo().then(r => console.log(r));

        getUserTeams().then(teams => console.log(teams));
    }, [user]);

    return (
        <section className={`${style.profileSection} flex-column largeGap mediumPadding space-between`}>


            <div className={`${style.userInfoContainer} flex-column align-center largePadding mediumGap`}>
                <div className={`${style.iconContainer} flex-row flex-center mediumPadding`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#e3e3e3" className={`${style.profileIcon}`} viewBox="0 -960 960 960">
                        <path
                            d="M40-272q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v32q0 33-23.5 56.5T600-160H120q-33 0-56.5-23.5T40-240v-32Zm698 112q11-18 16.5-38.5T760-240v-40q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v40q0 33-23.5 56.5T840-160H738ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113Z"/>
                    </svg>
                </div>

                <h2>{user.email}</h2>
            </div>

            <div className={`${style.teamCountContainer} flex-column align-center mediumGap mediumPadding`}>
                <h3>Nº de times</h3>
                {
                    <p>{String(teams.length).padStart(4, '0')}</p>
                }
            </div>


            <button className={`${style.logOut} button`} onClick={handleLogout}>SAIR</button>
        </section>
    );
}