import style from "../RegisterForm/registerForm.module.css";
import {useState} from "react";

export default function RegisterForm({register}) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});

    // VALIDA UM CAMPO POR VEZ
    const validate = (fieldName, value) => {
        const errors = {};

        switch (fieldName) {
            case "email":
                if (!value) {
                    errors.email = "Email é obrigatório";
                }
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    errors.email = "Email inválido";
                }
                break;
            case "password":
                if (!value) errors.password = "Senha é obrigatória";
                else if (value.length < 6) errors.password = "Senha deve ter pelo menos 6 caracteres";
                break;
            case "confirmPassword":
                if (!value) errors.confirmPassword = "Confirmação de senha é obrigatória";
                else if (value !== formData.password) errors.confirmPassword = "As senhas não coincidem";
                break;
            default:
                break;
        }

        return errors;
    };

    // VALIDA O FORMULÁRIO INTEIRO USANDO validate
    const validateForm = () => {
        const errors = {};

        Object.keys(formData).forEach(fieldName => {
            const fieldErrors = validate(fieldName, formData[fieldName]);
            Object.assign(errors, fieldErrors);
        });

        return errors;
    };

    // NO SUBMIT VALIDA O FORMULÁRIO INTEIRO E LIMPA OS ERROS
    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validateForm();
        setErrors(errors);

        if (Object.keys(errors).length === 0) register(formData);
    };

    const isFormValid = Object.keys(errors).length === 0 && formData.email && formData.password && formData.confirmPassword;

    return (
        <div className={`flex-column flex-center largeGap`}>
            <form className={`flex-column flex-center largeGap`} onSubmit={handleSubmit}>
                <div className={`flex-column mediumGap flex-center`}>
                    <div className={`flex-column smallGap`}>
                        <label className={`labelSize`} htmlFor="email">Email</label>
                        {errors.email && (
                            <span className={`errorMessage`}>{errors.email}</span>
                        )}
                        <input onChange={(e) => setFormData({...formData, "email": e.target.value})}
                               type="email"
                               id="email"
                               name="email"
                               required/>
                    </div>

                    <div className={`flex-column smallGap`}>
                        <label className={`labelSize`} htmlFor="password">Senha</label>
                        {errors.password && (
                            <span className={`errorMessage`}>{errors.password}</span>
                        )}
                        <input onChange={(e) => setFormData({...formData, "password": e.target.value})}
                               type="password"
                               id="password"
                               name="password"
                               required/>
                    </div>

                    <div className={`flex-column smallGap`}>
                        <label className={`labelSize`} htmlFor="confirmPassword">Confirmar Senha</label>
                        {errors.confirmPassword && (
                            <span className={`errorMessage`}>{errors.confirmPassword}</span>
                        )}
                        <input onChange={(e) => setFormData({...formData, "confirmPassword": e.target.value})}
                               type="password"
                               id="confirmPassword"
                               name="confirmPassword"
                               required/>
                    </div>
                </div>

                <button className={`button`} disabled={!isFormValid} type="submit">Cadastrar</button>
            </form>
        </div>
    )
}