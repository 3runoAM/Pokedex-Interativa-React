

export default function SummaryPokemonCard({pokemon}) {
    if (!pokemon) return <p>Carregando...</p>;

    return (
        <div style={{maxWidth: "8rem"}} className={`flex-column justify-center smallGap smallPadding`}>
            <img className={`smallPadding`} style={{width: "8rem"}} src={pokemon.sprite_url} alt={pokemon.name}/>

            <div className="flex-column align-center smallGap">
                <h6 style={{fontSize: "2rem"}}>{pokemon.name.charAt(0).toUpperCase()}{pokemon.name.slice(1)}</h6>
                <p style={{fontSize: "1.4rem"}}>#{String(pokemon.pokedex_id).padStart(4, "0")}</p>
            </div>
        </div>
    )
}