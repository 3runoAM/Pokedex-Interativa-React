import {Link} from "react-router-dom";
import style from "./Menu.module.css"

export default function Menu() {
    return (
        <nav className={`${style.menu} flex-row flex-center mediumPadding`}>
            <ul className={`flex-row flex-center`}>

                <li>
                    <Link to={"/teams"}>
                        <div className={`flex-row flex-center`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="#e3e3e3" className={`${style.menuIcon}`} viewBox="0 -960 960 960">
                                <path d="M40-272q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v32q0 33-23.5 56.5T600-160H120q-33 0-56.5-23.5T40-240v-32Zm698 112q11-18 16.5-38.5T760-240v-40q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v40q0 33-23.5 56.5T840-160H738ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113Z"/>
                            </svg>
                        </div>
                    </Link>
                </li>

                <li>
                    <Link to={"/home"}>
                        <div className={`flex-row flex-center`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="#F2F2F2FF" className={`${style.menuIcon} bi bi-house-door-fill`} viewBox="0 0 16 16">
                                <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5"/>
                            </svg>
                        </div>
                    </Link>
                </li>


                <li>
                    <Link to={"/profile"}>
                        <div className={`flex-row flex-center`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="#e3e3e3" className={`${style.menuIcon}`} viewBox="0 -960 960 960">
                                <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-240v-32q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v32q0 33-23.5 56.5T720-160H240q-33 0-56.5-23.5T160-240Z"/>
                            </svg>
                        </div>
                    </Link>
                </li>


            </ul>
        </nav>
    );
}