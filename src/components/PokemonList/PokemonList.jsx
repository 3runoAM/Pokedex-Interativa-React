import style from './PokemonList.module.css';
import PokemonCard from "../PokemonCard/PokemonCard";

export default function PokemonList({list, isLoadingMore}) {
    if (list.length === 0 && !isLoadingMore) {
        return <p className={`${style.loading}`}>Nenhum pokemon encontrado nessa rota :(</p>
    } else if (list.length === 0 && isLoadingMore) {
        return <p className={style.loading}>Procurando na grama alta...</p>
    }

    return (
        <ul className={`flex-column mediumGap align-center`}>


            {list.map(pokemon => (
                <li className={style.list}>
                    <PokemonCard pokemonInfo={pokemon}/>
                </li>

            ))}

            {isLoadingMore && <p className={style.loading}>Carregando...</p>}
        </ul>
    );
}