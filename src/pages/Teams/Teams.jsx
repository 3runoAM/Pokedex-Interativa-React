import style from "./Teams.module.css";
import {useEffect, useState} from "react";
import dataBase from "../../services/DataBase";
import {useToast} from "../../Provider/ToastProvider";
import {Link} from "react-router-dom";

export default function Teams() {
    const [user, _] = useState(JSON.parse(localStorage.getItem("user")));
    const [teams, setTeams] = useState([]);
    const {showToast} = useToast();
    const CREATION_TEAM_ID = "60753bbe-2c1f-4e40-963a-21ea6c14c777";

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
        fetchUserTeams();
    }, [user]);

    return (
        <section className={`${style.teamSection} flex-column align-center smallPadding mediumGap`}>
            <h2>Teams</h2>


            <div className={`${style.buttonContainer} flex-row justify-center smallGap smallPadding`}>
                <Link to={`/teams/teamEditor/${CREATION_TEAM_ID}`} className={`flex-row flex-center smallPadding`}>
                    New Team
                </Link>
                <button className={`flex-row flex-center smallPadding`} onClick={() => handleDeleteAll()}>
                    Delete All
                </button>
            </div>

            <ul className={`${style.teamsContainer} flex-column mediumGap`}>
                {teams?.map((team) => (
                    <li key={team.id} className={`${style.teamCard} flex-row mediumPadding smallGap`}>

                        <div className={`${style.teamInfoContainer} flex-column`}>

                            <Link className={` flex-column smallGap`}
                                  to={`/teams/teamDetails/${team.id}`} state={{team: team}}>
                                <h3>{team.name}</h3>
                                <p>Pokemon {team.PokemonPartner.length}/6</p>
                            </Link>

                            <div className={`flex-column smallGap`}>
                                <Link to={`/teams/teamEditor/${team.id}`}
                                      state={{team: team}}
                                      className={`${style.editButton} button`}>Edit</Link>
                                <button className={`${style.deleteButton} button`}
                                        onClick={() => handleDelete(team.id)}>Delete
                                </button>
                            </div>
                        </div>

                        <div className={`${style.partnersImageContainer} flex-row smallGap`}>
                            {
                                team.PokemonPartner.map((partner) => (
                                    <img key={partner.Pokemon.id} className={`${style.pokemonSprite}`}
                                         src={partner.Pokemon.sprite_url}
                                         alt={partner.Pokemon.name}/>
                                ))}
                        </div>
                    </li>
                ))}
            </ul>

            <div className={`largePadding`}><br/><br/></div>
        </section>
    );
}