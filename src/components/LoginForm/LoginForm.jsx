import style from './LoginForm.module.css'

export function LoginForm() {


    return (
        <>
            <form className={`${style.form} gap flex-column center`} action="">
                <div className={`${style.formDiv} flex-column gap`}>
                    <div className={`${style.inputContainer} flex-column gap`}>
                        <label className={`${style.labelSize} labelSize`} htmlFor="email">Email</label>
                        <input className={style.input} type="email" id="email" name="email" required />
                    </div>

                    <div className={`${style.inputContainer} flex-column gap`}>
                        <label className={`${style.labelSize} labelSize`} htmlFor="password">Password</label>
                        <input className={style.input} type="password" id="password" name="password" required />
                    </div>
                </div>


                <button className={`${style.button} button login`} type="submit">Entrar</button>
            </form>
        </>
    )
}