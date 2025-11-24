import styles from './SummaryPokemonCard.module.css';

export default function  SummaryPokemonCard({pokemon}) {
    if (!pokemon) return <p>Carregando...</p>;

    return (
        <div className={`${styles.summaryContainer} flex-column justify-center smallGap smallPadding`}>
            <img className={`${styles.summaryImage} smallPadding`} src={pokemon.sprite_url} alt={pokemon.name}/>

            <div className="flex-column align-center smallGap">
                <h6 className={`${styles.pokemonName}`}>{pokemon.name.charAt(0).toUpperCase()}{pokemon.name.slice(1)}</h6>
                <p className={`${styles.pokemonNumber}`}>#{String(pokemon.pokedex_id).padStart(4, "0")}</p>
            </div>
        </div>
    )
}