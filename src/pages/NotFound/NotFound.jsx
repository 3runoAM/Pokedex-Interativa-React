import style from "./NotFound.module.css"

export default function NotFound() {
    return (
        <div className={`${style.container} flex-column flex-center`}>
            <h1 className={style.title}>Não encontramos essa rota :(</h1>
        </div>
    );
}