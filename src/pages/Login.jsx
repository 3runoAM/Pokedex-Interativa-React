import style from './Login.module.css'

<<<<<<< HEAD
import Logo from '../components/Logo/Logo.jsx';
=======
import Logo from  '../components/Logo/Logo.jsx';
>>>>>>> 374f7cd083837d5a6f05b9d93f944cafad5b0b1c
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