import style from './LoginForm.module.css'

export function LoginForm() {


    return (
        <>
            <form className={`${style.gap} flex-column center`} action="">
                <div className="flex-column">
                    <label className="labelSize" htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" required />
                </div>

                <div className="flex-column">
                    <label className="labelSize" htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" required />
                </div>
                <button className="button login" type="submit">Entrar</button>
            </form>
        </>
    )
}