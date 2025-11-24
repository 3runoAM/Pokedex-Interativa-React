import styles from './Register.module.css';
import Authentication from './../../services/Authentication';
import RegisterForm from '../../components/RegisterForm/RegisterForm';
import Logo from "../../components/Logo/Logo";
import Footer from "../../components/Footer/Footer";
import LoginLink from "../../components/LoginLink/LoginLink";
import {useNavigate} from "react-router-dom";
import {useToast} from "../../provider/ToastProvider";

export default function Register() {
    const navigate = useNavigate();
    const {showToast} = useToast();

    const handleRegister = async (formData) => {
        try {
            const {data, error} = await Authentication.register(formData.email, formData.password);

            if (error) throw new Error("There was an error during registration: " + error.message);

            showToast("Registration successful! Please check your email to verify your account.");

            navigate("/login");
        } catch (err) {
            showToast(`It was not possible to register: ${err.message}`);
        }
    }

    return (
        <div className={`${styles.registerContainer} flex-column`}>
            <Logo/>
            <RegisterForm register={handleRegister}/>
            <LoginLink/>
            <Footer/>
        </div>
    );
}
