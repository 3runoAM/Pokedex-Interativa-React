import style from './PokemonList.module.css';
import PokemonCard from "../PokemonCard/PokemonCard";

export default function PokemonList({list, isLoadingMore}) {
    if (list.length === 0 && !isLoadingMore) {
        return <p className={`${style.loading}`}>We couldn't find any Pokémon on this route. :(</p>
    } else if (list.length === 0 && isLoadingMore) {
        return <p className={style.loading}>Searching for Pokémon in the tall grass...</p>
    }

    return (
        <ul className={`${style.list} flex-row flex-wrap smallGap align-center`}>
            {list.map(pokemon => (
                <li className={`${style.pokeCard}`}>
                    <PokemonCard pokemonInfo={pokemon}/>
                </li>
            ))}
        </ul>
    );
}