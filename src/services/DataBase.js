import {supabase} from "./SupabaseClient";

const dataBase = {
    create: async (table, data) => {
        const response = await supabase.from(table)
            .insert(data);

        if (response.error) {
            console.error("Erro ao criar recurso:", response.error);
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

    getById: async (table, id) => {
        const response = await supabase.from(table)
            .select("*")
            .eq("id", id);

        if (response.error) {
            console.error("Erro ao buscar recurso por ID:", response.error);
            return [];
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
        const startIndex = (currentPage - 1) * 10;
        const endIndex = currentPage * 10 - 1;

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
            console.error("Erro ao verificar existência do recurso:", response.error);
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
    },

    getWeaknessByTypeName: async (type_name) => {
        const { data: typeData, error: typeError } = await supabase
            .from("Type")
            .select("id")
            .eq("name", type_name)
            .limit(1);

        if (typeError) {
            console.error("Erro ao buscar tipo:", typeError);
            return [];
        }
        if (!typeData || typeData.length === 0) return [];

        const typeId = typeData[0].id;

        const { data, error } = await supabase.from("Weakness")
            .select("weakness_type_id ( name )")
            .eq("type_id", typeId);

        if (error) {
            console.error("Erro ao buscar fraquezas:", error);
            return [];
        }

        console.log("Retornando: ", data);
        return data;
    },

    existsRelation: async (table, column1, value1, column2, value2) => {
        const response = await supabase.from(table)
            .select("*")
            .eq(column1, value1)
            .eq(column2, value2);

        if (response.error) {
            console.error("Erro ao verificar existência da relação:", response.error);
            return false;
        }

        if (response.data.length === 0) return false;
        return response.data.length === 1;
    },

    getAllPokemonNames: async () => {
        const response = await supabase.from("Pokemon")
            .select("name")
            .order("pokedex_id");

        if (response.error) {
            // console.error("Erro ao buscar nomes dos Pokémons:", response.error);
            return [];
        }

        return response.data.map(pokemon => pokemon.name);
    },

    searchByNameOrPokedexId: async (nameOrId) => {

        Number(nameOrId) ? console.log("Pesquisando por ID: ", nameOrId) : console.log("Pesquisando por nome: ", nameOrId);

        const response = Number(nameOrId) ?
            await supabase.from("Pokemon")
                .select("*")
                .or(`pokedex_id.eq.${nameOrId}`)
                .order("pokedex_id") :
            await supabase.from("Pokemon")
                .select("*")
                .or(`name.ilike.%${nameOrId}%`)
                .order("pokedex_id")
                .limit(10);

        if (response.error) {
            console.error("Erro ao buscar Pokémon:", response.error);
        }

        return response.data;
    },

    getTeamsByUserId: async (user_id) => {
        const response = await supabase.from("Team")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", { ascending: false });

        if (response.error) {
            console.error("Erro ao buscar times do usuário:", response.error);
            return [];
        }

        console.log("Retornando: ", user_id, ". Com equipes: ", response.data);

        return response.data;
    },

};

export default dataBase;