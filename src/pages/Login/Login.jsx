import style from './Login.module.css'
import Logo from '../../components/Logo/Logo.jsx';
import {LoginForm} from '../../components/LoginForm/LoginForm.jsx';
import RegisterLink from "../../components/RegisterLink/RegisterLink";
import Footer from '../../components/Footer/Footer.jsx';

export default function Login() {

    return (
        <div className={`${style.loginContainer} flex-column mediumGap mediumPadding`}>
            <Logo></Logo>
            <LoginForm></LoginForm>
            <RegisterLink/>
            <Footer></Footer>
        </div>
    );
}