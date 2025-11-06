import styles from './Home.module.css';
import {useEffect, useState} from "react";
import usePokeApi from "../../hooks/usePokeApi";
import dataBase from "../../services/DataBase";
import PokemonList from "../../components/PokemonList/PokemonList";
import SearchBar from "../../components/SearchBar/SearchBar";
import Toast from "../../components/Toast/Toast";
import {useToast} from "../../Provider/ToastProvider";

export default function Home() {
    const {updatePokemonBasicInfo} = usePokeApi();
    const {showToast} = useToast();

    const [currentPage, setCurrentPage] = useState(1);

    const [pokemonList, setPokemonList] = useState([]);

    const [loadingMore, setLoadingMore] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const [pokemonNameList, setPokemonNameList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearchMode, setIsSearchMode] = useState(false);
    const [showList, setShowList] = useState(false);

    const [searchResults, setSearchResults] = useState([]);

    const [error, setError] = useState("");

    const DISABLE_PREDICATE = loadingMore || (currentPage === 49) || isSearchMode;

    const getPokemonNames = async () => {
        try {
            const nameList = await dataBase.getAllPokemonNames();
            setPokemonNameList(nameList);
        } catch (err) {
            console.error(err);
            showToast("Erro ao carregar nomes dos Pokémons.");
        }
    };

    const handleLoadMore = async () => {
        if (DISABLE_PREDICATE) return;

        setCurrentPage(prevPage => prevPage + 1);
    };

    const handleGoBack = () => {
        setIsSearchMode(false);
        setSearchResults([]);
        setSearchTerm("");
    }

    const handleSearch = async (searchTerm) => {
        setSearchResults([]);

        if (!searchTerm || searchTerm.trim() === "") {
            setIsSearchMode(false);
            return;
        }

        try {
            setIsSearching(true);
            const searchResult = await dataBase.searchByNameOrPokedexId(searchTerm.trim().toLowerCase());
            const typedResults = await ensureTypes(searchResult);

            setSearchResults(typedResults || []);
            setIsSearchMode(true);
            setIsSearching(false);
        } catch (err) {
            console.error(err);
            showToast("Erro ao buscar Pokémon.");
            setIsSearchMode(false);
            setIsSearching(false);
        }
    }

    function ensureTypes(pokemonArray) {
        return Promise.all(pokemonArray.map(async (pokemon) => {
            if (!pokemon.types || pokemon.types.length === 0) {
                const typesResponse = await dataBase.getPokemonTypes(pokemon.id);
                pokemon.types = typesResponse;
            }
            return pokemon;
        }));
    }

    useEffect(() => {
        setLoadingMore(true)

        const fetchAndUpdate = async () => {
            try {
                console.log("Carregando página ", currentPage);
                // await updatePokemonBasicInfo(currentPage);

                const results = await dataBase.getPokemon(currentPage);
                const typedPokemon = await ensureTypes(results)

                setPokemonList(prevList => [...prevList, ...typedPokemon]);
                setLoadingMore(false);
            } catch (err) {
                console.error(err);
                showToast("Erro ao carregar Pokémons.");
                setLoadingMore(false);
            }
        };

        fetchAndUpdate();

    }, [currentPage]);

    useEffect(() => {
        getPokemonNames();
    }, []);

    return (
        <section className={`flex-column largeGap`}>

            <Toast message={error}/>
            
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
                        <PokemonList isLoadingMore={isSearching} list={searchResults}/>
                    </> :
                    <>
                        <PokemonList isLoadingMore={loadingMore} list={pokemonList}/>
                        <div className={`${styles.buttonsContainer} flex-column flex-center mediumGap`}>
                            <button className={`${styles.loadMore} button`} disabled={DISABLE_PREDICATE}
                                    onClick={handleLoadMore}>Carregar mais
                            </button>
                        </div>
                    </>
            }


            <div className={"largePadding"}></div>
        </section>
    );
}