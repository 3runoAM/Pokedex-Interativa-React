import {supabase} from "./SupabaseClient";

const Authentication = {
    login: async (email, password) => {
        return await supabase.auth.signInWithPassword({
            email,
            password
        });
    },

    register: async (email, password) => {
        return await supabase.auth.signUp({
            email,
            password
        });
    },

    isAuthenticated: async () => {
        const { data } = await supabase.auth.getUser();
        return data.user !== null;
    },

    logOut: () => {
        return supabase.auth.signOut();
    }
}

export default Authentication;