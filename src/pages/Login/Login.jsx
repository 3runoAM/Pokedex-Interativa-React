import style from './Login.module.css'
import Authentication from "../../services/Authentication";
import {useNavigate} from "react-router-dom";
import Logo from '../../components/Logo/Logo.jsx';
import {LoginForm} from '../../components/LoginForm/LoginForm.jsx';
import RegisterLink from "../../components/RegisterLink/RegisterLink";
import Footer from '../../components/Footer/Footer.jsx';
import {useToast} from "../../provider/ToastProvider";


export default function Login({setIsAuthenticated}) {
    const navigate = useNavigate();
    const {showToast} = useToast();

    const handleLogin = async (formData) => {
        try {
            localStorage.removeItem("user");

            const {data, error} = await Authentication.login(formData.email, formData.password);

            if (error) throw error;

            showToast("Login successful!");
            localStorage.setItem("user", JSON.stringify(data.user.user_metadata));
            setIsAuthenticated(true);

            navigate("/home");
        } catch (err) {
            console.log(err);
            showToast(`It was not possible to login: ${err.message}`);
        }
    }

    return (
        <div className={`${style.loginContainer} flex-column mediumGap`}>
            <Logo></Logo>
            <LoginForm login={handleLogin}></LoginForm>
            <RegisterLink/>
            <Footer></Footer>
        </div>
    );
}