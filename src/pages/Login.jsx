import style from './Login.module.css'

import Logo from  '../components/Logo/Logo.jsx';
import {LoginForm} from '../components/LoginForm/LoginForm.jsx';
import RegisterLink from '../components/RegisterLink/RegisterLink.jsx';
import Footer from '../components/Footer/Footer.jsx';

export default function Login() {



    return (
        <div className={`${style.loginContainer} flex-column`}>
            <Logo></Logo>
            <LoginForm></LoginForm>
            <RegisterLink></RegisterLink>
            <Footer></Footer>
        </div>
    );
}