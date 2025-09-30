import style from './LoginLink.module.css'
import {Link} from "react-router-dom";

export default function LoginLink(){

    return (
        <div className="flex-column center">
            <p className={`${style.labelSize} labelSize`}>Já possui uma conta?</p>
            <Link className={`${style.button} button`} to="/login">Entrar</Link>
        </div>
    )
}