import {useCallback, useState} from "react";
import dataBase from "../services/DataBase";

const usePokeApi = () => {
    const URL_BASE_POKEMON = "https://pokeapi.co/api/v2/pokemon";
    const URL_BASE_SPECIES = "https://pokeapi.co/api/v2/pokemon-species";
    const URL_BASE_ARTWORK = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/"
    const URL_BASE_TYPE = "https://pokeapi.co/api/v2/type";

    const [loading, setLoading] = useState(false);
    const [errors, setError] = useState([]);

    const updatePokemonBasicInfo = useCallback(async (currentPage) => {
        try {
            setLoading(true);
            setError([]);

            const startIndex = (currentPage - 1) * 10 + 1;
            const endIndex = currentPage * 10 - 1;

            const ids = [];
            for (let i = startIndex; i < endIndex; i++) {
                const exists = await dataBase.pokemonExistsByPokedexId(i)
                if (exists) continue;
                ids.push(i);
            }
            if (ids.length === 0) {
                setLoading(false);
                return {loading, errors, updatePokemonBasicInfo};
            }

            const promises = ids.map(async (i) => {
                try {
                    const pokeResult = await fetch(`${URL_BASE_POKEMON}/${i}`).then(res => res.json());
                    const speciesResult = await fetch(`${URL_BASE_SPECIES}/${i}`).then(res => res.json());

                    return {
                        name: pokeResult.name,
                        description: speciesResult.flavor_text_entries
                                .find(entry => entry.language.name === "en")
                                .flavor_text.replace(/\f/g, " "),
                        sprite_url: `${URL_BASE_ARTWORK}${pokeResult.id}.png`,
                        hp: pokeResult.stats[0].base_stat,
                        attack: pokeResult.stats[1].base_stat,
                        defense: pokeResult.stats[2].base_stat,
                        special_attack: pokeResult.stats[3].base_stat,
                        special_defense: pokeResult.stats[4].base_stat,
                        speed: pokeResult.stats[5].base_stat,
                        pokedex_id: pokeResult.id,
                        types: pokeResult.types.map(t => ({
                            name: t.type.name
                        }))
                    };
                } catch (err) {
                    setError(prev => [...prev, err.message]);
                    return null;
                }
            });

            const results = await Promise.all(promises);
            const pokemonInfo = results.filter(pokemon => pokemon && pokemon.description && pokemon.types);

            for (const pokemon of pokemonInfo) {
                const currentPokemon = {
                    name: pokemon.name,
                    description: pokemon.description,
                    sprite_url: pokemon.sprite_url,
                    hp: pokemon.hp,
                    attack: pokemon.attack,
                    defense: pokemon.defense,
                    special_attack: pokemon.special_attack,
                    special_defense: pokemon.special_defense,
                    speed: pokemon.speed,
                    pokedex_id: pokemon.pokedex_id,

                }
                const currentTypes = pokemon.types;

                const pokemonWasCreated = await dataBase.create("Pokemon", currentPokemon);

                if (currentTypes.length > 0) {
                    for (const type of currentTypes) {
                        const exists = await dataBase.existsByName("Type", type.name);

                        if (!exists) {
                            const created = await dataBase.create("Type", {name: type.name})
                        }

                        const registeredPokemon = await dataBase.getByName("Pokemon", pokemon.name);
                        const registeredType = await dataBase.getByName("Type", type.name);

                        const pm = await dataBase.create("PokemonType", {
                            pokemon_id: registeredPokemon[0].id, type_id: registeredType[0].id
                        });
                    }
                }
            }
            setLoading(false);
        } catch (err) {
            setError(prev => [...prev, err.message]);
        }

        setLoading(false);
        return {loading, errors, updatePokemonBasicInfo};
    }, [errors, loading]);

    const updateTypeWeaknesses = useCallback(async (types) => {
        setLoading(true);
        setError([]);

        try {
            for (const type of types) {
                const typeName = type.name || type;

                const typeResponse = await fetch(`${URL_BASE_TYPE}/${typeName}`).then(res => res.json());
                const doubleWeaknesses = typeResponse.damage_relations.double_damage_from.map(w => w.name);


                for (const weakness of doubleWeaknesses) {
                    const exists = await dataBase.existsByName("Type", weakness);

                    if (!exists) await dataBase.create("Type", {name: weakness});

                    const [registeredType] = await dataBase.getByName("Type", typeName);
                    const [registeredWeakness] = await dataBase.getByName("Type", weakness);

                    if (!registeredType || !registeredWeakness) {
                        console.warn("Não foi possível obter tipo ou fraqueza:", typeName, weakness);
                        continue;
                    }

                    const alreadyExists = await dataBase.existsRelation("Weakness", "type_id", registeredType.id, "weakness_type_id", registeredWeakness.id);

                    if (!alreadyExists) {
                        await dataBase.create("Weakness", {
                            type_id: registeredType.id, weakness_type_id: registeredWeakness.id
                        });
                    }
                }
            }

        } catch (err) {
            console.error("Erro ao atualizar fraquezas:", err);
            setError(prev => [...prev, err.message]);
        } finally {
            setLoading(false);
        }
    }, []);


    return {
        loading, errors, updatePokemonBasicInfo, updateTypeWeaknesses
    };
}

export default usePokeApi;