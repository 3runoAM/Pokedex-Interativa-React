import styles from './Register.module.css';
import RegisterForm from '../../components/RegisterForm/RegisterForm';
import Logo from "../../components/Logo/Logo";
import Footer from "../../components/Footer/Footer";
import LoginLink from "../../components/LoginLink/LoginLink";

export default function Register() {
    return (
        <div className={`${styles.registerContainer} flex-column`}>
            <Logo/>
            <RegisterForm/>
            <LoginLink/>
            <Footer/>
        </div>
    );
}