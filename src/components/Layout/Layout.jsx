import Menu from "../Menu/Menu";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <>
            <Outlet/>
            <Menu />
        </>
    );
}