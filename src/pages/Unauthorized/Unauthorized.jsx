import style from "./Unauthorized.module.css";
import {Link} from "react-router-dom";

export default function Unauthorized() {
    return (
        <section className={`${style.unauthorized} flex-column largeGap mediumPadding justify-center`}>
            <h2>Sign in or register to access this page.</h2>

            <div  className={`flex-row mediumGap justify-center`}>
                <Link className={`${style.login} button`} to="/login" >Sign in</Link>
                <Link className={`${style.register} button`} to="/register">Register</Link>
            </div>
        </section>
    )
}