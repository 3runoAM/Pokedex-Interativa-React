import style from './LoginLink.module.css'

export default function LoginLink(){

    return (
        <div className="flex-column center">
            <p className={`${style.labelSize} labelSize`}>Já possui uma conta?</p>
            <a className={`${style.button} button`} href="#">Entrar</a>
        </div>
    )
}