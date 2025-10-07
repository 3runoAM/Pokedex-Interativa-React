import {supabase} from "./SupabaseClient";

const dataBase = {
    create: async (table, data) => {
        const response = await supabase.from(table)
            .insert(data);

        if (response.error) {
            // console.error("Erro ao criar recurso:", response.error);
            return null;
        }

        if (response.status === 201) {
            return true;
        }
    },

    list: async (table, orderProp) => {
        const response = await supabase.from(table)
            .select("*")
            .order(orderProp);

        if (response.error) {
            console.error("Erro ao listar recursos:", response.error);
            return [];
        }
        return response.data;
    },

    find: async (table, name) => {
        const response = await supabase.from(table)
            .select("*")
            .eq("name", name)
            .single();
        if (response.error) {
            console.error("Erro ao buscar Pokémon:", response.error);
            return null;
        }
        return response.data;
    },

    pokemonExistsByPokedexId: async (pokedex_id) => {
        const {data, err} = await supabase
            .from("Pokemon")
            .select("*")
            .eq("pokedex_id", pokedex_id);

        if (err) console.error("PokemonExistsByPokedexId ERROR: " + err.message);

        if (data.length === 0) return false;
        return data.length === 1;
    },

    getPokemon: async (currentPage) => {
        const startIndex = (currentPage - 1) * 20;
        const endIndex = currentPage * 20 - 1;

        const response = await supabase.from("Pokemon")
            .select("*")
            .order("pokedex_id")
            .range(startIndex, endIndex);

        if (response.error) {
            console.error("Erro ao buscar recursos:", response.error);
            return [];
        }

        return response.data;
    },

    existsByName: async (table, name) => {
        const response = await supabase.from(table)
            .select("name")
            .eq("name", name);

        if (response.error) {
            // console.error("Erro ao verificar existência do recurso:", response.error);
            return false;
        }

        if (response.data.length === 0) return false;
        return response.data.length === 1;
    },

    getByName: async (table, name) => {
        const response = await supabase.from(table)
            .select("*")
            .eq("name", name);


        if (response.error) {
            // console.error("Erro ao buscar recurso:", response.error);
            return false;
        }

        return response.data;
    },

    getPokemonTypes: async (pokemon_id) => {
        const response = await supabase.from("PokemonType")
            .select("Type(name)")
            .eq("pokemon_id", pokemon_id);


        if (response.error) {
            console.error("Erro ao buscar tipos do Pokémon:", response.error);
            return [];
        }

        return response.data.map(pokemonType => pokemonType.Type);
    }
};

export default dataBase;