import styles from './Home.module.css';
import Authentication from "../../services/Authentication";
import { useNavigate } from "react-router-dom";
import {useCallback, useEffect} from "react";
import usePokeApi from "../../hooks/usePokeApi";
import PokemonList from "../../components/PokemonList/PokemonList";


export default function Home() {
    const navigate = useNavigate();
    const {listPokemon, findBy, pokemonList, pokemon, isLoading, error} = usePokeApi()

    const handleLogout = async () => {
        await Authentication.logOut();
        localStorage.clear();
        navigate('/login');
    };

    useEffect(() => {
        listPokemon('created_at', 'desc', 10)
    }, [listPokemon])

    const fetchPokemonById = useCallback(async (id) => {
        const data = await findBy(id);
        console.log(data);
    }, [findBy]);

    return (
        <>
            <h1>Home</h1>

            {isLoading && <p>Carregando...</p>}
            {error && <p className="error">{error}</p>}

            <PokemonList list={pokemonList} />
            <button className={`${styles.button} button`} onClick={handleLogout}>SAIR</button>
        </>
    );
}