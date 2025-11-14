import dataBase from "../../services/DataBase";
import {useEffect, useState} from "react";
import {useToast} from "../../Provider/ToastProvider";
import {useNavigate} from "react-router-dom";

export default function NewTeam() {
    const [formData, setFormData] = useState({
        teamName: "",
        partnersIds: []
    });
    const navigate = useNavigate();

    const [teamIsFull, setTeamIsFull] = useState(false);

    const {showToast} = useToast();
    const [pokemonList, setPokemonList] = useState([]);

    const handleChangeOfPartnerId = (e) => {
        if (teamIsFull) {
            showToast("Time completo! Você não pode adicionar mais Pokémons");
            return;
        }

        const {_, value} = e.target;

        console.log("Adicionando parceiro: ", value);

        setFormData(prev => ({
            ...prev,
            partnersIds: [...prev.partnersIds, value]
        }));
    }

    const handleChangeOfTeamName = (e) => {
        const {_, value} = e.target;

        setFormData(prev => ({
            ...prev,
            teamName: value
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
            } else if (formData.partnersIds.length === 0) {
                showToast("Você deve adicionar pelo menos um Pokemon ao time");
                return;
            }

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

            await dataBase.addPokemonPartnersToTeam(pokemonPartners);
            console.log("Parceiros adicionados ao time com sucesso!");


            console.log("Redirecionando para a página de times...");
            navigate("/teams");
        } catch (error) {
            console.error("Erro ao criar time:", error);
            showToast("Erro ao criar time.");
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
    }, []);

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


    console.log("Renderizando NewTeam com estado: ", formData, "e lista de Pokémons: ", pokemonList);

    return (
        <section style={{maxWidth: "90%"}} className={`flex-column largeGap mediumPadding align-center`}>
            <h2>New team</h2>

            <form className={`flex-column largeGap mediumPadding`}>

                <div className={`flex-column smallGap`}>
                    <label htmlFor="name">Team name</label>
                    <input id="name"
                           value={formData.teamName}
                           onChange={(e) => handleChangeOfTeamName(e)}
                           type="text"/>
                </div>


                <div className={`flex-column smallGap`}>
                    <h3>Select your partners</h3>

                    <select id="partnersIds"
                            onChange={(e) => handleChangeOfPartnerId(e)}>
                        {
                            pokemonList.map((pokemon) => (
                                <option value={pokemon.pokedex_id}>
                                    {pokemon.name.charAt(0).toUpperCase()}{pokemon.name.slice(1)} #{String(pokemon.pokedex_id).padStart(4, "0")}
                                </option>))
                        }
                    </select>
                </div>


            </form>

            <div className={`flex-column smallGap`} style={{maxWidth: "90%"}}>
                <h3>Your team: {formData.teamName}</h3>

                <div className={`flex-row smallGap mediumPadding`} style={{maxWidth: "90%", overflow: "auto"}}>
                    {
                        formData.partnersIds?.map((partnerId) => {
                            const pokemon = pokemonList.filter(p => p.pokedex_id === Number(partnerId))[0];
                            console.log("Renderizando parceiro: ", partnerId, " com dados: ", pokemon);

                            return (
                                <div className={`flex-column align-center smallPadding smallGap`}>
                                    <MiniCard pokemon={pokemon}/>
                                    <button onClick={() => handleRemove(partnerId)}>Remove</button>
                                </div>
                            );
                        })}
                </div>

                <button onClick={(e) => handleSubmit(e)}>Create team</button>
            </div>
        </section>
    );
}

export function MiniCard({pokemon}) {
    if (!pokemon) return <p>Carregando...</p>;

    return (
        <div className="flex-column smallPadding">
            <div className="flex-column flex-center smallGap smallPadding">
                <img style={{width: "20px"}} src={pokemon.sprite_url} alt={pokemon.name}/>
                <div className="flex-column flex-center smallGap">
                    <h6>{pokemon.name.charAt(0).toUpperCase()}{pokemon.name.slice(1)}</h6>
                    <p>#{String(pokemon.pokedex_id).padStart(4, "0")}</p>
                </div>
            </div>
        </div>
    )
}