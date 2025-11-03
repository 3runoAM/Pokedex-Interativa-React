import style from "./Unauthorized.module.css";
import {Link} from "react-router-dom";

export default function Unauthorized() {
    return (
        <section className={`${style.unauthorized} flex-column largeGap mediumPadding justify-center`}>
            <h2>Faça login, ou registre-se, para ter acesso a essa funcionalidade</h2>

            <div  className={`flex-row mediumGap justify-center`}>
                <Link className={`${style.login} button`} to="/login" >Login</Link>
                <Link className={`${style.register} button`} to="/register">Registrar</Link>
            </div>
        </section>
    )
}