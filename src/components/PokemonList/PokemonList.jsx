import style from './PokemonList.module.css';
import PokemonCard from "../PokemonCard/PokemonCard";

export default function PokemonList({list, isLoadingMore}) {
    if (list.length === 0 && !isLoadingMore) {
        return <p className={`${style.loading}`}>Nenhum pokemon encontrado nessa rota :(</p>
    } else if (list.length === 0 && isLoadingMore) {
        return <p className={style.loading}>Procurando na grama alta...</p>
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