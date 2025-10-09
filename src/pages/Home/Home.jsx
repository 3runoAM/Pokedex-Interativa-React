    import styles from './Home.module.css';
    import Authentication from "../../services/Authentication";
    import {useNavigate} from "react-router-dom";
    import {useEffect, useState} from "react";
    import usePokeApi from "../../hooks/usePokeApi";
    import dataBase from "../../services/DataBase";
    import PokemonList from "../../components/PokemonList/PokemonList";
    import SearchBar from "../../components/SearchBar/SearchBar";

    export default function Home() {
        // const navigate = useNavigate();
        const {loading, error, listPokemon} = usePokeApi();

        const [currentPage, setCurrentPage] = useState(1);
        const [pokemonList, setPokemonList] = useState([]);
        const [loadingMore, setLoadingMore] = useState(false);

        const [pokemonNameList, setPokemonNameList] = useState([]);

        const [isSearchMode, setIsSearchMode] = useState(false);
        const [searchResults, setSearchResults] = useState([]);

        const disablePredicate = loadingMore || currentPage === 49 || isSearchMode;


        const handleLoadMore = async () => {
            if (disablePredicate) return;

            setCurrentPage(prevPage => prevPage + 1);
        };

        const getPokemonNames = async (searchTerm) => {
            const nameList = await dataBase.getAllPokemonNames();

            setPokemonNameList(nameList);
        };

        const onSearch = async (searchTerm) => {
            if (!searchTerm || searchTerm.trim() === "") {
                setIsSearchMode(false);
                setSearchResults([]);
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

                <SearchBar onSearch={onSearch} PokemonNameList={pokemonNameList}/>

                {isSearchMode && <button className={`${styles.goBack} button`} onClick={(e) => (setIsSearchMode(false))}>Voltar</button>}

                <PokemonList isLoadingMore={loadingMore} list={ isSearchMode ? searchResults : pokemonList}/>

                <div className={`${styles.buttonsContainer} flex-column flex-center mediumGap`}>
                    <button className={`${styles.loadMore} button`} disabled={disablePredicate}
                            onClick={handleLoadMore}>Carregar mais
                    </button>
                </div>
                <div className={"largePadding"}></div>
            </section>
        );
    }