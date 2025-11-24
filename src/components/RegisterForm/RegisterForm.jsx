import style from "../RegisterForm/registerForm.module.css";
import {useState} from "react";
import {useToast} from "../../provider/ToastProvider";

export default function RegisterForm({register}) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const {showToast} = useToast();

    const validateField = (fieldName, value) => {
        const errors = {};

        switch (fieldName) {
            case "email":
                if (!value) errors.email = "Email is mandatory"
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errors.email = "Invalid email";
                break;

            case "password":
                if (!value) errors.password = "Password is mandatory";
                else if (value.length < 6) errors.password = "Password must be at least 6 characters long";
                break;

            case "confirmPassword":
                if (!value) errors.confirmPassword = "Please confirm your password";
                else if (value !== formData.password) errors.confirmPassword = "Passwords do not match";
                break;

            default:
                break;
        }

        return errors;
    };

    const validateForm = () => {
        const errors = {};

        Object.keys(formData).forEach(fieldName => {
            const fieldErrors = validateField(fieldName, formData[fieldName]);
            Object.assign(errors, fieldErrors);
        });

        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const errors = validateForm();
        setErrors(errors);

        if (Object.keys(errors).length === 0) {
            register(formData)
        }
        else {
            showToast(`Please fix the errors in the form before submitting: ${Object.values(errors).join(", ")}`)
            setTimeout(() => {
                setErrors({});
            }, 5000);
        }
    };

    const isFormValid = Object.keys(errors).length === 0 && formData.email && formData.password && formData.confirmPassword;

    return (
        <div className={`flex-column flex-center largeGap`}>
            <form className={`${style.form} flex-column flex-center largeGap`} onSubmit={handleSubmit}>
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