import styles from './Home.module.css';
import Authentication from "../../services/Authentication";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import usePokeApi from "../../hooks/usePokeApi";
import dataBase from "../../services/DataBase";
import PokemonList from "../../components/PokemonList/PokemonList";

export default function Home() {
    const navigate = useNavigate();
    const {loading, error, listPokemon} = usePokeApi();
    const [currentPage, setCurrentPage] = useState(1);
    const [pokemonList, setPokemonList] = useState([]);
    const [loadingMore, setLoadingMore] = useState(false);

    const handleLogout = async () => {
        await Authentication.logOut();
        localStorage.clear();
        navigate('/login');
    };

    const handleLoadMore = async () => {
        if (currentPage == 49) return;
        setCurrentPage(prevPage => prevPage + 1);
    };

    useEffect(() => {
        setLoadingMore(true)
        const fetchAndUpdate = async () => {
            await listPokemon(currentPage);
            const result = await dataBase.getPokemon(currentPage);
            for (let pokemon of result) {
                if (!pokemon.types || pokemon.types.length === 0) {
                    const typesResponse = await dataBase.getPokemonTypes(pokemon.id);
                    pokemon.types = typesResponse;
                }
            }
            setPokemonList(prevList => [...prevList, ...result]);
            setLoadingMore(false);
        };
        fetchAndUpdate();
    }, [currentPage]);

    return (
        <section className={`flex-column largeGap`}>

            <PokemonList isLoadingMore={loadingMore} list={pokemonList}/>

            <div className={`${styles.buttonsContainer} flex-column flex-center mediumGap`}>
                <button className={`${styles.loadMore} button`} disabled={loadingMore || (currentPage === 49)} onClick={handleLoadMore}>Carregar mais</button>
                <button className={`${styles.logOut} button`} onClick={handleLogout}>SAIR</button>
            </div>

        </section>
    );
}