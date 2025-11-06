import {useLocation, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import styles from "./PokemonDetails.module.css";
import usePokeApi from "../../hooks/usePokeApi";
import dataBase from "../../services/dataBase";
import {useToast} from "../../Provider/ToastProvider";

export default function PokemonDetails() {
    const {id} = useParams();
    const location = useLocation();
    const cachedPokemon = location.state?.pokemon;

    const {updateTypeWeaknesses} = usePokeApi();
    const {showToast} = useToast();

    const [pokemon, setPokemon] = useState(cachedPokemon ?? null);
    const [pokemonWeaknesses, setPokemonWeaknesses] = useState(new Set());

    const [loading, setLoading] = useState(!cachedPokemon);
    const [loadingWeaknesses, setLoadingWeaknesses] = useState(false);
    const [error, setError] = useState(null);

    console.log("PokemonDetails mounted with id:", id, " cachedPokemon:", cachedPokemon);


    useEffect(() => {
        const fetchPokemonDetails = async (pokemonId) => {
            try {
                setLoading(true);
                const results = await dataBase.getById("Pokemon", pokemonId);
                if (results.length > 0) {
                    const fetchedPokemon = results[0];

                    const typesResponse = await dataBase.getPokemonTypes(fetchedPokemon.id);
                    fetchedPokemon.types = typesResponse;

                    setLoading(false);
                    console.log("Pokémon encontrado:", fetchedPokemon);
                    setPokemon(fetchedPokemon);
                }
            } catch (err) {
                showToast("Erro ao buscar detalhes do Pokémon: " + err.message, "error");
                console.error("Erro ao buscar detalhes do Pokémon:", err);
                setError("Erro ao buscar detalhes do Pokémon.");
                setLoading(false);
            }
        }

        const fetchWeaknesses = async (types) => {
            try {
                setLoadingWeaknesses(true);
                await updateTypeWeaknesses(types);
                const weaknessesSet = new Set();

                await Promise.all(types.map(async type => {
                    const results = await dataBase.getWeaknessByTypeName(type.name);
                    results.forEach(item => {
                        const name = item?.weakness_type_id?.name || item?.name;
                        if (name) weaknessesSet.add(name);
                    });
                }));

                console.log("Setando fraquezas: ", weaknessesSet.values());
                setPokemonWeaknesses(weaknessesSet);
                setLoadingWeaknesses(false);
            } catch (err) {
                showToast("Erro ao buscar fraquezas: " + err.message, "error");
                console.error("Erro ao buscar fraquezas:", err);
                setError("Erro ao buscar fraquezas.");
                setLoadingWeaknesses(false);
            }
        };

        if (pokemon && pokemon.types) {
            fetchWeaknesses(pokemon.types);
        } else {
            fetchPokemonDetails(id)
                .then(() => {
                    if (pokemon && pokemon.types) {
                        fetchWeaknesses(pokemon.types);
                    }
                });
        }
    }, [id, updateTypeWeaknesses]);

    if (loading) return (<p className={`labelSize`}>Loading Pokemon details...</p>);

    return (
        <section className={`${styles.pokemonDetailsSection} flex-column align-center mediumPadding largeGap`}>

            <div className={`${styles.nameNumberContainer} flex-column align-center smallPadding`}>
                <h2>{pokemon.name.charAt(0).toUpperCase()}{pokemon.name.slice(1)}</h2>
                <h3>#{String(pokemon.pokedex_id).padStart(4, '0')}</h3>
            </div>

            <img className={`${styles.pokemonImage} mediumPadding`}
                 src={pokemon.sprite_url}
                 alt={pokemon.name}
            />

            <p className={`${styles.pokeDescription} smallPadding`}>{pokemon.description}</p>

            <div className={`${styles.statisticsContainer} flex-column align-center mediumGap`}>
                <h3>Statistics</h3>

                <dl className={`flex-column align-center smallGap mediumPadding`}>

                    <div className={`flex-row largeGap smallPadding`}>
                        <dt>HP</dt>
                        <dd>{pokemon.hp}</dd>
                    </div>

                    <div className={`flex-row largeGap smallPadding`}>
                        <dt>Attack</dt>
                        <dd>{pokemon.attack}</dd>
                    </div>

                    <div className={`flex-row largeGap smallPadding`}>
                        <dt>Defense</dt>
                        <dd>{pokemon.defense}</dd>
                    </div>

                    <div className={`flex-row largeGap smallPadding`}>
                        <dt>Speed</dt>
                        <dd>{pokemon.speed}</dd>
                    </div>

                    <div className={`flex-row largeGap smallPadding`}>
                        <dt>Special Attack</dt>
                        <dd>{pokemon.special_attack}</dd>
                    </div>

                    <div className={`flex-row largeGap smallPadding`}>
                        <dt>Special Defense</dt>
                        <dd>{pokemon.special_defense}</dd>
                    </div>
                </dl>
            </div>

            <div className={`${styles.typesContainer} flex-column align-center mediumGap`}>
                <h3>Types</h3>
                <ul className={`flex-row justify-center mediumGap`}>
                    {pokemon.types.map(type => (
                        <li className={`${type.name} flex-row flex-center`}>{type.name.charAt(0).toUpperCase()}{type.name.slice(1)}</li>))}
                </ul>
            </div>

            <div className={`${styles.typesContainer} flex-column align-center mediumGap`}>
                <h3>Weaknesses</h3>

                {loadingWeaknesses && <p>Loading weaknesses...</p>}

                <ul className={`flex-row justify-center mediumGap`}>
                    {
                        Array.from(pokemonWeaknesses).map(weakness => (
                            <li className={`${weakness} flex-row flex-center`}>
                                {weakness.charAt(0).toUpperCase()}{weakness.slice(1)}
                            </li>)
                        )
                    }
                </ul>
            </div>

            <div className="largePadding "></div>
        </section>
    );
}