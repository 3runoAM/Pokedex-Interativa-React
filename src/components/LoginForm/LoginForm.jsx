import {useState} from "react";
import style from "./LoginForm.module.css"
import {useToast} from "../../Provider/ToastProvider";
import {useNavigate} from "react-router-dom";
import {supabase} from "../../services/SupabaseClient";

export function LoginForm({login}) {
    const {showToast} = useToast();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({});

    const handleForgetPassword = async (e) => {
        e.preventDefault();
        if (formData.email === "" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            showToast("Please enter a valid email address");
            return;
        }

        try {
            let {data, error} = await supabase.auth.resetPasswordForEmail(formData.email, { redirectTo: "http://localhost:3000/newPassword" });

            showToast(`An email has been sent to ${formData.email} for a password reset`);
        } catch (err) {
            console.log(err)
            showToast("Something went wrong, please try again");
        }
    }

    // VALIDA UM CAMPO POR VEZ
    const validate = (fieldName, value) => {
        const errors = {};
        switch (fieldName) {
            case "email":
                if (!value) errors.email = "Email é obrigatório";
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    errors.email = "Email inválido";
                }
                break;
            case "password":
                if (!value) errors.password = "Senha é obrigatória";
                else if (value.length < 6) errors.password = "Senha deve ter pelo menos 6 caracteres";
                break;
            default:
                break;
        }
        return errors;
    };

    // VALIDA O FORMULÁRIO INTEIRO USANDO validate()
    const validateForm = () => {
        const errors = {};
        Object.keys(formData).forEach(fieldName => {
            const fieldErrors = validate(fieldName, formData[fieldName]);
            Object.assign(errors, fieldErrors);
        });
        return errors;
    };

    // NO SUBMIT, VALIDA O FORMULÁRIO INTEIRO
    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        const errors = validateForm();
        setErrors(errors);

        if (Object.keys(errors).length === 0) login(formData);
        else showToast("Erro ao fazer login: Verifique os dados informados");
    };

    return (
        <form className={`${style.form} flex-column flex-center mediumGap`} onSubmit={handleSubmit}>
            <div className={`${style.formDiv} flex-column mediumGap flex-center`}>
                <div className={`${style.inputContainer} flex-column`}>
                    <label className={`${style.labelSize} labelSize`} htmlFor="email">Email</label>
                    {errors.email && (
                        <span className="errorMessage">{errors.email}</span>
                    )}
                    <input className={style.input}
                           onChange={(e) => setFormData({...formData, "email": e.target.value})}
                           type="email"
                           id="email"
                           name="email"
                           required/>
                </div>

                <div className={`${style.inputContainer} flex-column`}>
                    <label className={`${style.labelSize} labelSize`} htmlFor="password">Password</label>
                    {errors.password && (
                        <span className="errorMessage">{errors.password}</span>
                    )}
                    <input className={style.input}
                           onChange={(e) => setFormData({...formData, "password": e.target.value})}
                           type="password"
                           id="password"
                           name="password"
                           required/>
                </div>
            </div>

            <button className={style.link}
                    onClick={(e) => handleForgetPassword(e)}>
                Esqueci a senha
            </button>

            <button className={`${style.button} button`}
                    type="submit">
                Entrar
            </button>
        </form>
    )
}