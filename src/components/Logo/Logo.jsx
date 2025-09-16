import style from './Logo.module.css'

export default function Logo() {
    return (
            <div className={`${style.logoContainer} flex-column center`}>
                <img className={style.logoImage} src="/projeto-de-bloco.png" alt="Projeto de Bloco 2025E3"/>
                <img className={style.logoImage} src="/pokedex.png" alt="Pokédex"/>
            </div>
    );
}