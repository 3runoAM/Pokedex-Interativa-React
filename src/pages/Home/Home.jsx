import styles from './Home.module.css';
import Authentication from "../../services/Authentication";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import usePokeApi from "../../hooks/usePokeApi";
import dataBase from "../../services/DataBase";
import PokemonList from "../../components/PokemonList/PokemonList";
import SearchBar from "../../components/SearchBar/SearchBar";

export default function Home() {
    const {loading, error, listPokemon} = usePokeApi();

    const [currentPage, setCurrentPage] = useState(1);
    const [pokemonList, setPokemonList] = useState([]);
    const [loadingMore, setLoadingMore] = useState(false);

    const [pokemonNameList, setPokemonNameList] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [showList, setShowList] = useState(false);

    const [isSearchMode, setIsSearchMode] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    const disablePredicate = loadingMore || currentPage === 49 || isSearchMode;

    const getPokemonNames = async (searchTerm) => {
        const nameList = await dataBase.getAllPokemonNames();

        setPokemonNameList(nameList);
    };

    const handleLoadMore = async () => {
        if (disablePredicate) return;

        setCurrentPage(prevPage => prevPage + 1);
    };

    const handleSearch = async (searchTerm) => {
        setSearchResults([]);

        if (!searchTerm || searchTerm.trim() === "") {
            setIsSearchMode(false);
            return;
        }

        const results = await dataBase.searchByNameOrPokedexId(searchTerm.trim().toLowerCase());
        for (let pokemon of results) {
            if (!pokemon.types || pokemon.types.length === 0) {
                const typesResponse = await dataBase.getPokemonTypes(pokemon.id);
                pokemon.types = typesResponse;
            }
        }

        setSearchResults(results || []);
        setIsSearchMode(true);
    }

    const handleGoBack = () => {
        setIsSearchMode(false);
        setSearchResults([]);
        setSearchTerm("");
    }

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

    useEffect(() => {
        getPokemonNames();
    }, []);


    return (
        <section className={`flex-column largeGap`}>

            <SearchBar onSearch={handleSearch}
                       PokemonNameList={pokemonNameList}
                       searchTerm={searchTerm}
                       setSearchTerm={setSearchTerm}
                       showList={showList}
                       setShowList={setShowList}/>

            {
                isSearchMode ?
                    <>
                        <button className={`${styles.goBack} button`} onClick={handleGoBack}>Voltar</button>
                        <PokemonList isLoadingMore={loadingMore} list={searchResults}/>
                    </> :
                    <>
                        <PokemonList isLoadingMore={loadingMore} list={pokemonList}/>
                        <div className={`${styles.buttonsContainer} flex-column flex-center mediumGap`}>
                            <button className={`${styles.loadMore} button`} disabled={disablePredicate}
                                    onClick={handleLoadMore}>Carregar mais
                            </button>
                        </div>
                    </>
            }


            <div className={"largePadding"}></div>
        </section>
    );
}