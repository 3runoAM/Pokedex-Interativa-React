import style from "./Teams.module.css";
import {useEffect, useState} from "react";
import dataBase from "../../services/DataBase";
import {useToast} from "../../provider/ToastProvider";
import {Link} from "react-router-dom";
import {useConfirmation} from "../../provider/ConfirmationProvider";

export default function Teams() {
    const [user, _] = useState(JSON.parse(localStorage.getItem("user")));
    const [teams, setTeams] = useState([]);

    const {showToast} = useToast();
    const { getConfirmation } = useConfirmation();

    const CREATION_TEAM_ID = "60753bbe-2c1f-4e40-963a-21ea6c14c777";

    const fetchUserTeams = async () => {
        try {
            const teams = await dataBase.getTeamsByUserId(user.sub);

            setTeams(teams);

            return teams;
        } catch (error) {
            console.error("There was an error fetching user teams", error.message);
            showToast("There was an error fetching the teams");
        }
    }

    const handleDelete = async (teamId) => {
        const isConfirmed = await getConfirmation("Are you sure you want to delete this team? This action cannot be undone.")
        if (!isConfirmed) return;

        try {
            const isDeleted = await dataBase.deleteTeam(teamId);
            if (isDeleted) showToast("Team deleted");

            fetchUserTeams();
        } catch (err) {
            console.error("There was an error deleting the team", err.message);
            showToast("There was an error deleting the team");
        }
    }

    const handleDeleteAll = async () => {
        const isConfirmed = await getConfirmation("Are you sure you want to delete all teams? This action cannot be undone")
        if (!isConfirmed) return;

        try {
            debugger
            const userId = user.sub;
            const isDeleted = await dataBase.deleteAll(userId, "Team");
            if (isDeleted) showToast("All teams deleted");

            fetchUserTeams();
        } catch (err) {
            console.error("There was an error deleting all teams", err.message);
            showToast("There was an error deleting all teams");
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

                            <Link className={`flex-column smallGap`}
                                  to={`/teams/teamDetails/${team.id}`}
                                  state={{team: team}}>
                                <h3 className={`${style.teamLink}`}>{team.name}</h3>
                                <p>Pokemon {team.PokemonPartner.length}/6</p>
                            </Link>

                            <div className={`flex-column smallGap`}>
                                <Link to={`/teams/teamEditor/${team.id}`}
                                      state={{team: team}}
                                      className={`${style.editButton} button`}>
                                    Edit
                                </Link>
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
        </section>
    )
}