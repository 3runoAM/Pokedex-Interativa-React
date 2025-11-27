import style from './TeamDetails.module.css';
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import dataBase from "../../services/DataBase";
import {useToast} from "../../provider/ToastProvider";
import SummaryPokemonCard from "../../components/SummaryPokemonCard/SummaryPokemonCard";
import styles from "../PokemonDetails/PokemonDetails.module.css";
import {useConfirmation} from "../../provider/ConfirmationProvider";

export default function TeamDetails() {
    const [team, setTeam] = useState({
        name: "",
        pokemonPartners: [],
        teamStatistics: {
            totalPokemons: 0,
            averageHp: 0,
            averageAttack: 0,
            averageDefense: 0,
            averageSpeed: 0,
        }
    });

    
    const {id} = useParams();
    const location = useLocation();
    const cachedTeam = location.state?.team;

    const navigate = useNavigate();
    const {showToast} = useToast();
    const {getConfirmation} = useConfirmation();

    const handleDelete = async (teamId) => {
        try {
            
            const isConfirmed = await getConfirmation("Are you sure you want to delete this team? This action cannot be undone.");
            if (!isConfirmed) return;
            
            const isDeleted = await dataBase.deleteTeam(teamId);
            if (isDeleted) showToast("Team deleted successfully");

            navigate("/teams");
        } catch (err) {
            console.error("Erro ao deletar time: ", err);
            showToast("Erro ao deletar time");

            navigate("/teams");
        }
    }

    useEffect(() => {
        const calculateStatistics = (pokemonPartners) => {
            
            const totalPokemons = pokemonPartners.length;
            const totalHp = pokemonPartners.reduce((sum, p) => sum + p.hp, 0);
            const averageHp = totalPokemons ? Math.round(totalHp / totalPokemons) : 0;

            const totalAttack = pokemonPartners.reduce((sum, p) => sum + p.attack, 0);
            const averageAttack = totalPokemons ? Math.round(totalAttack / totalPokemons) : 0;

            const totalDefense = pokemonPartners.reduce((sum, p) => sum + p.defense, 0);
            const averageDefense = totalPokemons ? Math.round(totalDefense / totalPokemons) : 0;

            const totalSpeed = pokemonPartners.reduce((sum, p) => sum + p.speed, 0);
            const averageSpeed = totalPokemons ? Math.round(totalSpeed / totalPokemons) : 0;

            return {
                totalPokemons,
                averageHp,
                averageAttack,
                averageDefense,
                averageSpeed
            };
        };

        if (cachedTeam) {
            
            const partners = cachedTeam.PokemonPartner?.map(partner => partner.Pokemon);
            setTeam({
                name: cachedTeam.name,
                pokemonPartners: partners,
                teamStatistics: calculateStatistics(partners),
            });
            return;
        }

        const teamFetch = async () => {
            try {
                
                const team = await dataBase.getTeamById(id);
                if (team) {
                    location.state.team = team;

                    const partners = cachedTeam.PokemonPartner?.map(partner => partner.Pokemon);
                    setTeam({
                        name: cachedTeam.name,
                        pokemonPartners: partners,
                        teamStatistics: calculateStatistics(partners),
                    });
                    return;
                }

                showToast("Time não encontrado");

                navigate("/teams");
            } catch (err) {
                showToast("Erro ao obter time pelo ID");
                console.error("Erro ao obter time pelo ID: ", err);
            }
        }

        teamFetch();
    }, [])

    return (
        <section className={`${style.teamDetailsSection} flex-column align-center smallPadding mediumGap`}>

            <h2 className={`${style.teamName}`}>{team.name}</h2>


            <ul className={`${style.cardsContainer} flex-row flex-wrap justify-center`}>
                {
                    team.pokemonPartners.map((pokemon) => (
                        <li key={pokemon.id} className={`${style.pokemonCard} smallPadding`}>
                            <SummaryPokemonCard pokemon={pokemon}/>
                        </li>
                    ))
                }
            </ul>

            <div className={`${styles.statisticsContainer} flex-column align-center mediumGap`}>
                <h3>Teams statistics</h3>

                <dl className={`${style.statisticsContainer} flex-column align-center smallGap mediumPadding`}>
                    <div className={`flex-row largeGap smallPadding`}>
                        <dt>Total Pokemon</dt>
                        <dd>{team.pokemonPartners.length}</dd>
                    </div>

                    <div className={`flex-row largeGap smallPadding`}>
                        <dt>Average HP</dt>
                        <dd>{team.teamStatistics.averageHp}</dd>
                    </div>

                    <div className={`flex-row largeGap smallPadding`}>
                        <dt>Average Attack</dt>
                        <dd>{team.teamStatistics.averageAttack}</dd>
                    </div>

                    <div className={`flex-row largeGap smallPadding`}>
                        <dt>Average Defense</dt>
                        <dd>{team.teamStatistics.averageDefense}</dd>
                    </div>

                    <div className={`flex-row largeGap smallPadding`}>
                        <dt>Average Speed</dt>
                        <dd>{team.teamStatistics.averageSpeed}</dd>
                    </div>
                </dl>
            </div>

            <div className={`smallPadding`}></div>

            <div className={`${style.buttonContainer} flex-row smallGap smallPadding`}>
                <Link to={`/teams/teamEditor/${team.id}`}
                      state={{team: location.state?.team}}
                      className={`${style.editButton} button`}>Edit</Link>
                <button className={`${style.deleteButton} button`}
                        onClick={() => handleDelete(team.id)}>Delete
                </button>
            </div>
        </section>
    )
}