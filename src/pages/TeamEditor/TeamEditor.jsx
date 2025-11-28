import style from "./TeamEditor.module.css";
import dataBase from "../../services/DataBase";
import {useEffect, useState} from "react";
import {useToast} from "../../provider/ToastProvider";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import SummaryPokemonCard from "../../components/SummaryPokemonCard/SummaryPokemonCard";
import {useConfirmation} from "../../provider/ConfirmationProvider";

export default function TeamEditor() {
    const [formData, setFormData] = useState({
        teamName: "",
        partnersIds: []
    });
    const [teamIsFull, setTeamIsFull] = useState(false);
    const [pokemonList, setPokemonList] = useState([]);
    const [search, setSearch] = useState("");

    const {id} = useParams();
    const {showToast} = useToast();
    const {getConfirmation} = useConfirmation();

    const location = useLocation();
    const navigate = useNavigate();

    const cachedTeam = location.state?.team;
    const CREATION_TEAM_ID = "60753bbe-2c1f-4e40-963a-21ea6c14c777";

    const filteredPokemonList = pokemonList.filter(p => p.name.toLowerCase()
        .includes(search.toLowerCase()))
        .toSorted((a, b) => a.name.localeCompare(b.name))
        .slice(0, 4);

    const handleChangeOfTeamName = (e) => {
        const value = e.target.value;

        setFormData(prev => ({
            ...prev,
            teamName: value
        }));
    }

    const handleChangeOfPartnerId = (partnerId) => {
        setSearch("");
        if (teamIsFull) {
            showToast("Time completo!");
            return;
        }

        setFormData(prev => ({
            ...prev,
            partnersIds: [partnerId, ...prev.partnersIds]
        }));
    }

    const handleRemove = (partnerId) => {
        setFormData(prev => ({
            ...prev,
            partnersIds: prev.partnersIds.filter(id => id !== partnerId)
        }));
    }

    const handleSubmit = async (e) => {
        try {
            e.preventDefault()

            if (formData.teamName === "") {
                showToast("O nome do time não pode estar vazio.");
                return;
            } else if (formData.partnersIds?.length === 0) {
                showToast("Você deve adicionar pelo menos um Pokemon ao time");
                return;
            }

            if (id !== CREATION_TEAM_ID) {
                const isConfirmed = await getConfirmation("Are you sure you want to update this team?");
                if (!isConfirmed) return;

                await dataBase.updateTeamName(id, formData.teamName);

                const updatedPartners = formData.partnersIds.map((partnerId) => {
                    const partner = pokemonList.find(pokemon => pokemon.pokedex_id == partnerId);

                    return {
                        team_id: id,
                        pokemon_id: partner.id
                    };
                });

                const response = await dataBase.updateTeamPartners(id, updatedPartners);

                if (response) showToast("Team updated successfully")
            } else {
                const newTeam = await dataBase.createTeam({
                    name: formData.teamName.trim()
                });

                const pokemonPartners = formData.partnersIds.map((partnerId) => {
                    const partner = pokemonList.find(pokemon => pokemon.pokedex_id == partnerId);

                    return {
                        team_id: newTeam[0].id,
                        pokemon_id: partner.id
                    };
                });

                const response = await dataBase.addPokemonPartnersToTeam(pokemonPartners);

                if (response) showToast("Team created successfully")
            }

            navigate("/teams");
        } catch (error) {
            console.error("Erro ao criar time:", error);
            showToast("Erro ao criar ou atualizar time.");
        }
    }

    const getPokemonList = async () => {
        try {
            const pokemonList = await dataBase.getAllPokemonNamesAndIds();

            setPokemonList(pokemonList);
        } catch (err) {
            console.error(err);
            showToast("Erro ao carregar nomes dos Pokémons.");
        }
    };

    useEffect(() => {
        getPokemonList();
    }, [id, cachedTeam]);

    useEffect(() => {
        if (formData.partnersIds.length >= 6) {
            setTeamIsFull(true);
            showToast("Time completo!");
        } else {
            setTeamIsFull(false);
        }
    }, [formData.partnersIds]);

    useEffect(() => {
        if (id === CREATION_TEAM_ID) return;

        if (cachedTeam) {
            setFormData({
                teamName: cachedTeam.name,
                partnersIds: cachedTeam.PokemonPartner.map((p) => p.Pokemon?.pokedex_id)
            });
            return;
        }

        const fetchTeamData = async () => {
            try {
                const team = await dataBase.getTeamById(id);

                setFormData({
                    teamName: team.name,
                    partnersIds: (team.PokemonPartner.map((p) => p.Pokemon?.pokedex_id))
                })

            } catch (err) {
                console.error("Erro ao buscar dados do time: ", err);
                showToast("Erro ao carregar dados do time para edição.");
            }
        }

        fetchTeamData();
    }, [id, cachedTeam])

    return (
        <section className={`${style.newTeamPage} flex-column largeGap smallPadding align-center`}>
            <h2>New team</h2>

            <form className={`${style.teamForm} flex-column largeGap`}>

                <div className={`flex-column`}>
                    <label className={`${style.teamName}`} htmlFor="name">Team name</label>

                    <input id="name" max={25} min={1}
                           required placeholder="Team Rocket"
                           className={`${style.teamInput}`}
                           value={formData.teamName}
                           onChange={(e) => handleChangeOfTeamName(e)}
                           type="text"/>
                </div>

                <div className={`flex-column smallGap`}>
                    <h3 className={`${style.selectTeam}`}>Select your partners</h3>

                    <div className={`flex-column mediumGap`}>
                        <input placeholder="Search by name..."
                               className={`${style.teamInput}`}
                               value={search}
                               onChange={(e) => setSearch(e.target.value)}
                        />

                        {
                            (search.trim().length > 0) && (
                                <div className={`flex-row justify-center flex-wrap smallGap`}>
                                    {
                                        filteredPokemonList.map(p => (
                                            <div className={`flex-column smallGap`}>
                                                <SummaryPokemonCard pokemon={p}/>
                                                <button className={`${style.button} button`}
                                                        type="button"
                                                        onClick={() => handleChangeOfPartnerId(p.pokedex_id)}>
                                                    Adicionar
                                                </button>
                                            </div>
                                        ))
                                    }
                                </div>)
                        }
                    </div>
                </div>
            </form>

            {(formData.partnersIds.length > 0) && (
                <div className={`${style.partnerContainer} flex-column mediumGap mediumPadding`}>
                    <h3 className={style.yourTeam}>Your team: {formData.teamName}</h3>

                    <div className={`${style.partnersContainer} flex-row align-center smallGap`}>
                        {
                            formData.partnersIds.map((partnerId) => {
                                const pokemon = pokemonList.filter(p => p.pokedex_id === Number(partnerId))[0];

                                return (
                                    <div className={`${style.partners} flex-column align-center smallPadding smallGap`}>
                                        <SummaryPokemonCard pokemon={pokemon}/>


                                        <button className={`${style.removeButton} button`} type="button"
                                                onClick={(e) => handleRemove(partnerId)}>
                                            Remove
                                        </button>
                                    </div>
                                );
                            })}
                    </div>

                    <button className={`${style.button} button`} onClick={(e) => handleSubmit(e)}>
                        {
                            id === CREATION_TEAM_ID ? "Create team" : "Save team"
                        }
                    </button>
                </div>)
            }
        </section>
    );
}