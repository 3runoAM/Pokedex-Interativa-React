import {useState} from "react";
import style from "./LoginForm.module.css"
import {useToast} from "../../provider/ToastProvider";
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
            const {data, error} = await supabase.auth.resetPasswordForEmail(formData.email, { redirectTo: "http://localhost:3000/newPassword" });

            showToast(`An email has been sent to ${formData.email.split("@")[0]} for a password reset`);
        } catch (err) {
            console.log(err)
            showToast("Something went wrong, please try again");
        }
    }

    const validateField = (fieldName, value) => {
        const errors = {};
        switch (fieldName) {
            case "email":
                if (!value) errors.email = "Email is mandatory";
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    errors.email = "Email is invalid";
                }
                break;
            case "password":
                if (!value) errors.password = "Password is mandatory";
                else if (value.length < 6) errors.password = "Password must be at least 6 characters long";
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
        setErrors({});

        const errors = validateForm();
        setErrors(errors);

        if (Object.keys(errors).length === 0) login(formData);
        else {
            showToast(`Please fix the errors in the form before submitting: ${Object.values(errors).join(", ")}`)
            setTimeout(() => {
                setErrors({});
            }, 5000);
        };
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

            <button className={style.link} onClick={(e) => handleForgetPassword(e)}>
                Esqueci a senha
            </button>

            <button className={`${style.button} button`} type="submit">
                Entrar
            </button>
        </form>
    )
}