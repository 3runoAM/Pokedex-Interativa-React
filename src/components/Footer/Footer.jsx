import style from './footer.module.css'

export default function Footer() {
    return (
        <>
            <footer className="flex-column flex-center">
                <p className="labelSize">
                    Desenvolvido por <a className={style.link}
                       href="https://github.com/3runoam"
                       target="_blank"
                       rel="noreferrer">
                        3runoAM
                    </a>
                     ☕︎
                </p>
            </footer>
        </>
    )
}