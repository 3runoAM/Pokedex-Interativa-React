import style from './LoginLink.module.css'
import {Link} from "react-router-dom";

export default function LoginLink(){

    return (
        <div className="flex-column flex-center">
            <p className={`${style.labelSize} labelSize`}>Already have an account?</p>
            <Link className={`${style.button} button`} to="/login">Login</Link>
        </div>
    )
}