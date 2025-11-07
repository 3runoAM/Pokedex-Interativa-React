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
            if(isDeleted) showToast("Team deleted");
            fetchUserTeams();
        } catch (err) {
            console.log("Erro ao deletar time: ", err);
            showToast("Erro ao deletar time");
        }
    }

    const handleDeleteAll = async () => {
        try {
            for(const team of teams) {
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
        <section className={`flex-column align-center smallPadding mediumGap`}>
            <h2>Teams</h2>

            <div className={`flex-row flex-center mediumGap`}>
                <Link to={"/teams/new"}>Novo time</Link>
                <button onClick={() => handleDeleteAll()}>Excluir todos</button>
            </div>

            <ul>
                {
                    teams?.map((team) => (
                        <li>
                            <div className={`flex-column`}>
                                <h3>{team.name}</h3>

                                <div className={`flex-row mediumGap flex-center`}>
                                    <button>Edit</button>
                                    <button onClick={() => handleDelete(team.id)}>Delete</button>
                                </div>
                            </div>

                            <div className={`flex-row`} style={{flexWrap:"wrap"}} >
                                {
                                    team.PokemonPartner.map((partner) => (
                                        <div >
                                            <img style={{width:"1.5rem"}} src={partner.Pokemon.sprite_url} alt={partner.Pokemon.name}/>
                                        </div>
                                    ))
                                }
                            </div>
                        </li>
                    ))
                }
            </ul>
        </section>
    );
}