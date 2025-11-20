import style from './Login.module.css'
import Authentication from "../../services/Authentication";
import { useNavigate } from "react-router-dom";
import Logo from '../../components/Logo/Logo.jsx';
import {LoginForm} from '../../components/LoginForm/LoginForm.jsx';
import RegisterLink from "../../components/RegisterLink/RegisterLink";
import Footer from '../../components/Footer/Footer.jsx';
import {useToast} from "../../provider/ToastProvider";


export default function Login({ setIsAuthenticated }) {
    const navigate = useNavigate();
    const {showToast} = useToast();

    const handleLogin = async (formData) => {
        const errors = validateFormData(formData);

        if (Object.keys(errors).length > 0) {
            console.error("Erros de validação:", errors);
            showToast("Erro ao fazer login: Verifique os dados informados");
            return;
        }

        try {
            localStorage.removeItem("user");

            const {data, error} = await Authentication.login(formData.email, formData.password);
            if (error) throw error;

            localStorage.setItem("user", JSON.stringify(data.user.user_metadata));
            setIsAuthenticated(true);

            navigate("/home");
        } catch (err) {
            console.error(err);
            showToast("Erro ao fazer login");
        }
    }

    // VALIDA AS INFORMAÇÕES RECEBIDAS
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
                default:
                    break;
            }
        });

        return errors;
    };

    return (
        <div className={`${style.loginContainer} flex-column mediumGap`}>
            <Logo></Logo>
            <LoginForm login={handleLogin}></LoginForm>
            <RegisterLink/>
            <Footer></Footer>
        </div>
    );
}