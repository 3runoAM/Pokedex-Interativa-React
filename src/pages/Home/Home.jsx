import styles from './Home.module.css';
import {useEffect, useState} from "react";
import usePokeApi from "../../hooks/usePokeApi";
import dataBase from "../../services/DataBase";
import PokemonList from "../../components/PokemonList/PokemonList";
import SearchBar from "../../components/SearchBar/SearchBar";
import {useToast} from "../../provider/ToastProvider";
import style from "../../components/PokemonList/PokemonList.module.css";

export default function Home() {
    const {updatePokemonBasicInfo} = usePokeApi();
    const {showToast} = useToast();

    const [currentPage, setCurrentPage] = useState(1);

    const [showList, setShowList] = useState(false);
    const [pokemonList, setPokemonList] = useState([]);
    const [pokemonNameList, setPokemonNameList] = useState([]);

    const [loadingMore, setLoadingMore] = useState(false);

    const [isSearchMode, setIsSearchMode] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);

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
                // await updatePokemonBasicInfo(currentPage);

                const results = await dataBase.getPokemon(currentPage);
                const typedPokemon = await ensureTypes(results)

                setPokemonList(prevList => {
                    const newPokemons = typedPokemon.filter(newPokemon =>
                        !prevList.some(existingPokemon =>
                            existingPokemon.pokedex_id === newPokemon.pokedex_id
                        )
                    );
                    return [...prevList, ...newPokemons];
                });

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

    console.log("MONTANDO ESTA CACETA COM A LISTA: ", pokemonList);

    return (
        <section className={`${styles.home} flex-column align-center largeGap`}>
            
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

                        {loadingMore && <p className={style.loading}>Carregando...</p>}

                        <div className={`${styles.buttonsContainer} flex-column flex-center mediumGap`}>

                            <button className={`${styles.loadMore} button`}
                                    disabled={DISABLE_PREDICATE}
                                    onClick={handleLoadMore}>

                                Carregar mais

                            </button>

                        </div>
                    </>
            }
        </section>
    );
}