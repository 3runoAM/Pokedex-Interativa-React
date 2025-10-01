import {useState} from "react";
import style from "./LoginForm.module.css"

export function LoginForm({login}) {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({});

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
    };

    const isFormValid = Object.keys(errors).length === 0 && formData.email && formData.password;

    return (
        <form className={`${style.form} flex-column center mediumGap`} onSubmit={handleSubmit}>
            <div className={`${style.formDiv} flex-column mediumGap center`}>
                <div className={`${style.inputContainer} flex-column smallGap`}>
                    <label className={`${style.labelSize} labelSize`} htmlFor="email">Email</label>
                    {errors.email && (
                        <span className="errorMessage">{errors.email}</span>
                    )}
                    <input className={style.input}
                           onChange={(e) => setFormData({...formData, "email": e.target.value})}
                    type="email"
                    id="email"
                    name="email"
                    required />
                </div>

                <div className={`${style.inputContainer} flex-column smallGap`}>
                    <label className={`${style.labelSize} labelSize`} htmlFor="password">Password</label>
                    {errors.password && (
                        <span className="errorMessage">{errors.password}</span>
                    )}
                    <input className={style.input}
                           onChange={(e) => setFormData({...formData, "password": e.target.value})}
                    type="password"
                    id="password"
                    name="password"
                    required />
                </div>
            </div>

            <a href="#" className={style.link}>Esqueci a senha</a>

            <button className={`${style.button} button`}
                    disabled={!isFormValid}
                    type="submit">Entrar
            </button>
        </form>
    )
}