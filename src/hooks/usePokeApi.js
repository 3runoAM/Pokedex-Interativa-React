import {useCallback, useState} from "react";

const usePokeApi = () => {
    const URL_BASE_POKEMON = "https://pokeapi.co/api/v2/pokemon";
    const URL_BASE_SPECIES = "https://pokeapi.co/api/v2/pokemon-species";
    const [pokemonList, setPokemonList] = useState([]);
    const [pokemon, setPokemon] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const listPokemon = useCallback(async (orderBy, limit, page) => {


        return [];
    }, []);

    const findBy =  useCallback(async (id) => {

        return {};
    }, []);


    return {listPokemon, findBy, pokemonList, pokemon, isLoading, error };
}

export default usePokeApi;