import style from "../RegisterForm/registerForm.module.css";

export default function RegisterForm() {
    return (
        <div className={`flex-column center largeGap`}>
            <form className={`flex-column center largeGap`}>
                <div className={`flex-column mediumGap center`}>
                    <div className={`flex-column smallGap`}>
                        <label className={`labelSize`} htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" required/>
                    </div>

                    <div className={`flex-column smallGap`}>
                        <label className={`${style.labelSize} labelSize`} htmlFor="password">Senha</label>
                        <input className={style.input} type="password" id="password" name="password" required/>
                    </div>

                    <div className={`flex-column smallGap`}>
                        <label className={`${style.labelSize} labelSize`} htmlFor="confirmPassword">Confirmar
                            Senha</label>
                        <input className={style.input} type="password" id="confirmPassword" name="confirmPassword"
                               required/>
                    </div>
                </div>

                <button className={`button`} type="submit">Cadastrar</button>
            </form>
        </div>
    )
}