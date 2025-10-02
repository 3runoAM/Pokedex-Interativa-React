import {supabase} from "./SupabaseClient";
import {useCallback} from "react";

const useDataBase = () => {
    const isPokemonSaved = useCallback((pokemonName) => {
        return true;
    }, []);

    const savePokemon = useCallback(async (pokemon) => {
        return {};
    }, []);
}