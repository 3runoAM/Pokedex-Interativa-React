import {useCallback, useState} from "react";
import dataBase from "../services/DataBase";

const usePokeApi = () => {
    const URL_BASE_POKEMON = "https://pokeapi.co/api/v2/pokemon";
    const URL_BASE_SPECIES = "https://pokeapi.co/api/v2/pokemon-species";
    const URL_BASE_ARTWORK = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/"
    const URL_BASE_TYPE = "https://pokeapi.co/api/v2/type";
    const URL_BASE_MOVES = "https://pokeapi.co/api/v2/move";

    const [loading, setLoading] = useState(false);
    const [errors, setError] = useState([]);

    const listPokemon = useCallback(async (currentPage) => {
        setLoading(true);
        setError([]);

        const startIndex = (currentPage - 1) * 20 + 1;
        const endIndex = currentPage * 20;

        // SEPARA QUAIS IDS PRECISAM SER BUSCADOS NA API
        const ids = [];
        for (let i = startIndex; i < endIndex; i++) {
            if (await dataBase.pokemonExistsByPokedexId(i)) continue;
            ids.push(i);
        }
        if (ids.length === 0) {
            setLoading(false);
            return {loading, errors, listPokemon};
        }

        // MAPEIA AS PROMISES DE BUSCA NA API E TRATA OS DADOS
        const promises = ids.map(async (i) => {
            try {
                const pokeResult = await fetch(`${URL_BASE_POKEMON}/${i}`).then(res => res.json());
                const speciesResult = await fetch(`${URL_BASE_SPECIES}/${i}`).then(res => res.json());

                return {
                    name: pokeResult.name,
                    description: speciesResult.flavor_text_entries.find(entry => entry.language.name === "en")
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

        /*
        EXEMPLO DE OBJETO
        {
            "name": "spearow",
            "description": "It flaps its small wings busily to\nfly. Using its beak, it searches\nin grass for prey.",
            "sprite_url": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/21.png",
            "hp": 40,
            "attack": 60,
            "defense": 30,
            "special_attack": 31,
            "special_defense": 31,
            "speed": 70,
            "pokedex_id": 21,
            "types": [{"name": "normal"},
                      {"name": "flying"}]
        */

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

            console.log("POKEMON FOI REGISTRADO? ", pokemonWasCreated);

            if (currentTypes.length > 0) {
                for (const type of currentTypes) {
                    const exists = await dataBase.existsByName("Type", type.name);
                    if (!exists) {
                        const created = await dataBase.create("Type", {name: type.name})
                    }

                    const registeredPokemon = await dataBase.getByName("Pokemon", pokemon.name);
                    console.log("registeredPokemon: ", registeredPokemon);
                    const registeredType = await dataBase.getByName("Type", type.name);
                    console.log("registeredType: ", registeredType);
                    const pm = await dataBase.create("PokemonType", {
                        pokemon_id: registeredPokemon[0].id,
                        type_id: registeredType[0].id
                    });

                    console.log("Pokemon_Type foi registrado? ", pm);
                }
            }
        }
        setLoading(false);

        return {loading, errors, listPokemon};
    }, [errors, loading]);

    return {
        loading, errors, listPokemon
    };
}

export default usePokeApi;