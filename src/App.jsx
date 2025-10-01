import './App.css';
import {Route, Routes, useNavigate, useLocation} from "react-router-dom";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import {useEffect, useState} from "react";
import Home from "./pages/Home/Home";
import Authentication from "./services/Authentication";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const userToken = localStorage.getItem('user');

    const checkAuth = async () => {
        const isAuth = await Authentication.isAuthenticated();
        setIsAuthenticated(isAuth);
    }

    useEffect(() => {
        checkAuth();
    }, [userToken]);


    return (
        <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/login" element={<Login/>}/>

            <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
                <Route path="/home" element={<Home/>}/>
            </Route>
        </Routes>
    );
}