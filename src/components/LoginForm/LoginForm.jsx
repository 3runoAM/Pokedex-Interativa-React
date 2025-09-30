import style from './LoginForm.module.css'

export function LoginForm() {


    return (
        <>
            <form className={`${style.form} flex-column center mediumGap`} action="">
                <div className={`${style.formDiv} flex-column mediumGap center`}>
                    <div className={`${style.inputContainer} flex-column smallGap`}>
                        <label className={`${style.labelSize} labelSize`} htmlFor="email">Email</label>
                        <input className={style.input} type="email" id="email" name="email" required />
                    </div>

                    <div className={`${style.inputContainer} flex-column smallGap`}>
                        <label className={`${style.labelSize} labelSize`} htmlFor="password">Password</label>
                        <input className={style.input} type="password" id="password" name="password" required />
                    </div>
                </div>

                <a href="#" className={style.link}>Esqueci a senha</a>

                <button className={`${style.button} button`} type="submit">Entrar</button>
            </form>
        </>
    )
}