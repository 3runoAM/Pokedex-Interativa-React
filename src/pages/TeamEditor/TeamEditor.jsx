import style from "./TeamEditor.module.css";
import dataBase from "../../services/DataBase";
import {useEffect, useState} from "react";
import {useToast} from "../../Provider/ToastProvider";
import {data, useLocation, useNavigate, useParams} from "react-router-dom";
import SummaryPokemonCard from "../../components/SummaryPokemonCard/SummaryPokemonCard";

export default function TeamEditor() {
    const [formData, setFormData] = useState({
        teamName: "",
        partnersIds: []
    });

    const {id} = useParams();
    const location = useLocation();

    const cachedTeam = location.state?.team;
    const CREATION_TEAM_ID = "60753bbe-2c1f-4e40-963a-21ea6c14c777";
    const navigate = useNavigate();

    const [teamIsFull, setTeamIsFull] = useState(false);

    const {showToast} = useToast();
    const [pokemonList, setPokemonList] = useState([]);

    const [search, setSearch] = useState("");

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
            showToast("Time completo! Você não pode adicionar mais Pokémons");
            return;
        }

        console.log("Adicionando parceiro: ", partnerId);

        setFormData(prev => ({
            ...prev,
            partnersIds: [...prev.partnersIds, partnerId]
        }));
    }

    const handleRemove = (partnerId) => {
        console.log("Removendo parceiro: ", partnerId);

        console.log("Estado antes: ", formData);
        setFormData(prev => ({
            ...prev,
            partnersIds: prev.partnersIds.filter(id => id !== partnerId)
        }));
        console.log("Estado depois: ", formData);
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
                debugger
                console.log("Atualizando time")
                const updatedName = await dataBase.updateTeamName(id, formData.teamName);
                console.log("Atualizado: ", updatedName);

                console.log("Atualizando parceiros: ", formData.partnersIds);

                const updatedPartners = formData.partnersIds.map((partnerId) => {
                    const partner = pokemonList.find(pokemon => pokemon.pokedex_id == partnerId);
                    console.log("Pokemon encontrado: ", partner)

                    return {
                        team_id: id,
                        pokemon_id: partner.id
                    };
                });

                const response = await dataBase.updateTeamPartners(id, updatedPartners);
                console.log("Atualizado: ", updatedPartners);

                if (response) showToast("Team updated successfully")
            } else {
                const newTeam = await dataBase.createTeam({
                    name: formData.teamName.trim()
                });

                console.log("Time criado com sucesso! ", newTeam);

                const pokemonPartners = formData.partnersIds.map((partnerId) => {
                    const partner = pokemonList.find(pokemon => pokemon.pokedex_id == partnerId);

                    console.log("Pokemon encontrado: ", partner)

                    return {
                        team_id: newTeam[0].id,
                        pokemon_id: partner.id
                    };
                });

                console.log("Adicionando parceiros de Pokémon ao time:", pokemonPartners);

                const response = await dataBase.addPokemonPartnersToTeam(pokemonPartners);
                console.log("Parceiros adicionados ao time com sucesso!");

                if (response) showToast("Team created successfully")
            }

            console.log("Redirecionando para a página de times...");
            navigate("/teams");
        } catch (error) {
            console.error("Erro ao criar time:", error);
            showToast("Erro ao criar ou atualizar time.");
        }
    }

    const getPokemonList = async () => {
        try {
            console.log("Buscando pokemon list");
            const pokemonList = await dataBase.getAllPokemonNamesAndIds();

            console.log("Lista retornada: ", pokemonList);
            setPokemonList(pokemonList);
        } catch (err) {
            console.error(err);
            showToast("Erro ao carregar nomes dos Pokémons.");
        }
    };

    useEffect(() => {
        console.log("Carregando lista de Pokémons...");
        getPokemonList();
    }, [id, cachedTeam]);

    useEffect(() => {
        console.log("Verificando se o time está cheio...");
        if (formData.partnersIds.length >= 6) {
            setTeamIsFull(true);
            showToast("Time completo! Você não pode adicionar mais Pokémons.");
        } else {
            console.log("Time ainda não está cheio.");
            setTeamIsFull(false);
        }
    }, [formData.partnersIds]);

    useEffect(() => {
        console.log("Pokemon cached: ", cachedTeam)
        if (cachedTeam) {
            getPokemonList();
            setFormData({
                teamName: cachedTeam.name,
                partnersIds: cachedTeam.PokemonPartner.map((p) => p.Pokemon?.pokedex_id ?? p.pokemon_id)
            })
        }

    }, [id, cachedTeam])

    console.log("Renderizando TeamEditor com estado: ", formData, "e lista de Pokémons: ", pokemonList);

    return (
        <section className={`${style.newTeamPage} flex-column largeGap smallPadding align-center`}>
            <h2>New team</h2>

            <form className={`${style.teamForm} flex-column largeGap`}>

                <div className={`flex-column`}>
                    <label htmlFor="name">Team name</label>

                    <input id="name" max={25} min={1}
                           required placeholder="Team Rocket"
                           className={`${style.teamInput}`}
                           value={formData.teamName}
                           onChange={(e) => handleChangeOfTeamName(e)}
                           type="text"/>
                </div>

                <div className={`flex-column smallGap`}>
                    <h3>Select your partners</h3>

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
                <div style={{maxWidth: "100%"}} className={`flex-column smallGap`}>
                    <h3 style={{fontSize: "2rem"}}>Your team: {formData.teamName}</h3>

                    <div className={`flex-row smallGap mediumPadding`} style={{maxWidth: "100%", overflow: "auto"}}>
                        {
                            formData.partnersIds.map((partnerId) => {
                                const pokemon = pokemonList.filter(p => p.pokedex_id === Number(partnerId))[0];
                                console.log("Renderizando parceiro: ", partnerId, " com dados: ", pokemon?.name);

                                return (
                                    <div style={{width: "100%"}}
                                         className={`flex-column align-center smallPadding smallGap`}>
                                        <SummaryPokemonCard pokemon={pokemon}/>
                                        <button className={`${style.removeButton} button`} type="button"
                                                onClick={(e) => handleRemove(partnerId)}>Remove
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

            <div className={`largePadding`}><br/><br/></div>
        </section>
    );
}

