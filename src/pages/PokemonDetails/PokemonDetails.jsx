import {useLocation, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import styles from "./PokemonDetails.module.css";
import DataBase from "../../services/DataBase";
import usePokeApi from "../../hooks/usePokeApi";

export default function PokemonDetails() {
    const {id} = useParams();
    const location = useLocation();
    const cachedPokemon = location.state?.pokemon;

    const {updateTypeWeaknessess} = usePokeApi();

    const [pokemon, _] = useState(cachedPokemon ?? null);
    const [pokemonWeaknessess, setPokemonWeaknesses] = useState(new Set());

    const [loading, setLoading] = useState(!cachedPokemon);
    const [loadingWeaknesses, setLoadingWeaknesses] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoadingWeaknesses(true);

        const fetchWeaknesses = async (types) => {
            try {
                await updateTypeWeaknessess(types);
                const weaknessesSet = new Set();

                await Promise.all(types.map(async type => {
                    const results = await DataBase.getWeaknessByTypeName(type.name);
                    results.forEach(item => {
                        const name = item?.weakness_type_id?.name || item?.name;
                        if (name) weaknessesSet.add(name);
                    });
                }));

                console.log("Setando fraquezas: ", weaknessesSet.values());
                setPokemonWeaknesses(weaknessesSet);
                setLoadingWeaknesses(false);
            } catch (err) {
                console.error("Erro ao buscar fraquezas:", err);
                setError("Erro ao buscar fraquezas.");
                setLoadingWeaknesses(false);
            }
        };

        fetchWeaknesses(pokemon.types);
    }, [pokemon]);

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
                <h3>Weaknessess</h3>

                {loadingWeaknesses && <p>Loading weaknesses...</p>}

                <ul className={`flex-row justify-center mediumGap`}>
                    {
                        Array.from(pokemonWeaknessess).map(weakness => (
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