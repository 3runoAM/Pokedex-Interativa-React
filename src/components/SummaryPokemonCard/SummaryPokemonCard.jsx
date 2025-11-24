import styles from './SummaryPokemonCard.module.css';

export default function  SummaryPokemonCard({pokemon}) {
    if (!pokemon) return <p>Carregando...</p>;

    return (
        <div style={styles.summaryContainer} className={`flex-column justify-center smallGap smallPadding`}>
            <img className={`smallPadding`} style={styles.summaryImage} src={pokemon.sprite_url} alt={pokemon.name}/>

            <div className="flex-column align-center smallGap">
                <h6 style={styles.pokemonName}>{pokemon.name.charAt(0).toUpperCase()}{pokemon.name.slice(1)}</h6>
                <p style={styles.pokemonNumber}>#{String(pokemon.pokedex_id).padStart(4, "0")}</p>
            </div>
        </div>
    )
}