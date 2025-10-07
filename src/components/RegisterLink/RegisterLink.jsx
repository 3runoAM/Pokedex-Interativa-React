import style from './RegisterLink.module.css'
import {Link} from "react-router-dom";

export default function RegisterLink(){

    return (
        <div className="flex-column flex-center">
            <p className={`${style.labelSize} labelSize`}>Não tem uma conta?</p>
            <Link className={`${style.button} button`} to="/register">Registrar</Link>
        </div>
    )
}