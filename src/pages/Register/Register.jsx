import styles from './Register.module.css';
import Authentication from './../../services/Authentication';
import RegisterForm from '../../components/RegisterForm/RegisterForm';
import Logo from "../../components/Logo/Logo";
import Footer from "../../components/Footer/Footer";
import LoginLink from "../../components/LoginLink/LoginLink";
import {useNavigate} from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
    const handleRegister = async (formData) => {
        const errors = validateFormData(formData);

        if (Object.keys(errors).length > 0) {
            console.error("Erros de validação:", errors);
            return;
        }

        try {
            const {data, error} = await Authentication.register(formData.email, formData.password);
            if (error) throw error;

            navigate("/login");
        } catch (err) {
            console.error(err); // Colocar na Snackbar
        }
    }

    // VALIDA O FORMULÁRIO INTEIRO USANDO validate
    const validateFormData = (formData) => {
        const errors = {};

        Object.keys(formData).forEach(fieldName => {
            const fieldValue = formData[fieldName];

            switch (fieldName) {
                case "email":
                    if (!fieldValue) {
                        errors.email = "Email é obrigatório";
                    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fieldValue)) {
                        errors.email = "Email inválido";
                    }
                    break;
                case "password":
                    if (!fieldValue) errors.password = "Senha é obrigatória";
                    else if (fieldValue.length < 6) errors.password = "Senha deve ter pelo menos 6 caracteres";
                    break;
                case "confirmPassword":
                    if (!fieldValue) errors.confirmPassword = "Confirmação de senha é obrigatória";
                    else if (fieldValue !== formData.password) errors.confirmPassword = "As senhas não coincidem";
                    break;
                default:
                    break;
            }
        });

        return errors;
    };

    return (
        <div className={`${styles.registerContainer} flex-column`}>
            <Logo/>
            <RegisterForm register={handleRegister}/>
            <LoginLink/>
            <Footer/>
        </div>
    );
}
