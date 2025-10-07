import style from './PokemonCard.module.css';

export default function PokemonCard({pokemonInfo}) {
    return (
        <div className={`${style.pokeCard} flex-row flex-center smallPadding`}>
            <img className={`${style.pokeImage}`} src={pokemonInfo.sprite_url} alt={pokemonInfo.name}/>

            <div className={`${style.pokeInfoContainer} flex-column`}>

                <div className={`flex-column`}>
                    <h3>{pokemonInfo.name.charAt(0).toUpperCase()}{pokemonInfo.name.slice(1)}</h3>
                    <p>#{String(pokemonInfo.pokedex_id).padStart(4, '0')}</p>
                </div>

                <ul className={`flex-column flex-center smallgap`}>
                    {pokemonInfo.types && pokemonInfo.types.map(type => (
                        <li className={`${style.typeCard} ${type.name} flex-column`}>{type.name.charAt(0).toUpperCase()}{type.name.slice(1)}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}