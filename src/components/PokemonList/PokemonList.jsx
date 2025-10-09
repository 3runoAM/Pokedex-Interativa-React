import style from './PokemonList.module.css';
import PokemonCard from "../PokemonCard/PokemonCard";

export default function PokemonList({list, isLoadingMore}) {

    if (list.length === 0 ) return <p className={`${style.loading}`}>Nenhum Pokemon por aqui :(</p>

    return (
        <div className={`flex-column mediumGap align-center`}>

            {list.map(pokemon => (
                <PokemonCard pokemonInfo={pokemon}/>
            ))}

            {isLoadingMore && <p className={style.loading}>Carregando...</p>}
        </div>
    );
}