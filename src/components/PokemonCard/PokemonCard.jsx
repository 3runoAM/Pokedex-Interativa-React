import style from './PokemonCard.module.css';

export default function PokemonCard({pokemonInfo}) {
    return (
        <div className={`${style.pokeCard} flex-row mediumGap flex-center mediumPadding`}>

            <img className={`${style.pokeImage}`} src={pokemonInfo.sprite_url} alt={pokemonInfo.name}/>

            <div className={`${style.pokeInfoContainer} flex-column smallgap`}>
                <h3>{pokemonInfo.name.charAt(0).toUpperCase()}{pokemonInfo.name.slice(1)}</h3>
                <p>#{pokemonInfo.pokedex_id}</p>
                <div>
                    {pokemonInfo.types && pokemonInfo.types.map(type => (
                        <p>{type.name}</p>
                    ))}
                </div>
            </div>
        </div>
    )
}