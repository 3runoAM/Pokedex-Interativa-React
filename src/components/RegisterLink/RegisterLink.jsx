import style from './RegisterLink.module.css'

export default function RegisterLink(){

    return (
        <div className="flex-column center">
            <p className={`${style.labelSize} labelSize`}>Não tem uma conta?</p>
            <a className={`${style.button} button`} href="#">Cadastre-se</a>
        </div>
    )
}