import style from "./Teams.module.css";
import {useEffect, useState} from "react";
import dataBase from "../../services/DataBase";
import {useToast} from "../../Provider/ToastProvider";
import {Link} from "react-router-dom";

export default function Teams() {
    const [user, _] = useState(JSON.parse(localStorage.getItem("user")));
    const [teams, setTeams] = useState([]);
    const {showToast} = useToast();

    const fetchUserTeams = async () => {
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

    const handleDelete = async (teamId) => {
        try {
            const isDeleted = await dataBase.deleteTeam(teamId);
            if (isDeleted) showToast("Team deleted");
            fetchUserTeams();
        } catch (err) {
            console.log("Erro ao deletar time: ", err);
            showToast("Erro ao deletar time");
        }
    }

    const handleDeleteAll = async () => {
        try {
            for (const team of teams) {
                await dataBase.deleteTeam(team.id);
            }
            showToast("All teams deleted");
            fetchUserTeams();
        } catch (err) {
            console.log("Erro ao deletar todos os times: ", err);
            showToast("Erro ao deletar todos os times");
        }
    }

    useEffect(() => {
        fetchUserTeams().then(teams => console.log(teams));
    }, [user]);

    return (
        <section className={`${style.teamSection} flex-column align-center mediumPadding mediumGap`}>
            <h2>Teams</h2>


            <div className={`${style.buttonContainer} flex-row flex-center smallGap smallPadding`}>
                <Link to={"/teams/new"} className={`flex-row flex-center smallPadding`}>
                    New Team
                </Link>
                <button className={`flex-row flex-center smallPadding`} onClick={() => handleDeleteAll()}>
                    Delete All
                </button>
            </div>

            <ul className={`${style.teamsContainer} flex-column mediumGap`}>
                {teams?.map((team) => (
                    <li className={`${style.teamCard} flex-row mediumPadding mediumGap space-between`}>

                        <div className={`${style.teamInfoContainer} flex-column`}>
                            <div className={` flex-column smallGap`}>
                                <h3>{team.name}</h3>
                                <p>Pokemon {team.PokemonPartner.length}/6</p>
                            </div>


                            <div className={`flex-column smallGap`}>
                                <button className={`${style.editButton} button`}>Edit</button>
                                <button className={`${style.deleteButton} button`} onClick={() => handleDelete(team.id)}>Delete</button>
                            </div>
                        </div>

                        <div className={`${style.partnersImageContainer} flex-row smallGap`}>
                            {team.PokemonPartner.map((partner) => (
                                <img className={`${style.pokemonSprite} smallPadding`}
                                    src={partner.Pokemon.sprite_url}
                                     alt={partner.Pokemon.name}/>
                            ))}
                        </div>
                    </li>
                ))}
            </ul>

            <div className={`largePadding`}></div>
        </section>
    );
}