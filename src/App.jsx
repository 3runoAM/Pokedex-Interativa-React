import './App.css';
import {Route, Routes, useNavigate} from "react-router-dom";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import {useEffect, useState} from "react";
import Home from "./pages/Home/Home";
import Authentication from "./services/Authentication";

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const userToken = localStorage.getItem('user');
    const navigate = useNavigate();

    const checkAuth = async () => {
        const isAuth = await Authentication.isAuthenticated();
        setIsAuthenticated(isAuth);
    }

    useEffect(() => {
        checkAuth();
        if (userToken && isAuthenticated) navigate('/home');
        else navigate('/login');
    }, [isAuthenticated, userToken, navigate]);


    return (
        <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/home" element={<Home/>}/>
        </Routes>
    );
}