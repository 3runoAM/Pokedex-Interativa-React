import style from './PokemonList.module.css';
import PokemonCard from "../PokemonCard/PokemonCard";

export default function PokemonList( {list, isLoadingMore} ) {

    return (
        <>
            <div className={`flex-column mediumGap align-center`}>
                {list.map(pokemon => (
                    <PokemonCard pokemonInfo={pokemon} />
                ))}

                {isLoadingMore && <p>Carregando...</p>}
            </div>

        </>
    );
}