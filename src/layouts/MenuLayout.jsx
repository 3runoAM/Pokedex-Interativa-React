import Menu from "../components/Menu/Menu";
import { Outlet } from "react-router-dom";

export default function MenuLayout() {
    return (
        <>
            <Outlet/>
            <Menu />
        </>
    );
}