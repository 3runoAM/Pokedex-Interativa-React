import './App.css';
import {Route, Routes} from "react-router-dom";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import {useEffect, useState} from "react";
import Home from "./pages/Home/Home";
import Authentication from "./services/Authentication";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import Layout from "./components/Layout/Layout";
import Profile from "./components/Profile/Profile";
import Teams from "./components/Teams/Teams";

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const userToken = localStorage.getItem('user');

    const checkAuth = async () => {
        const isAuth = await Authentication.isAuthenticated();
        setIsAuthenticated(isAuth);
        setLoading(false);
    }

    useEffect(() => {
        setLoading(true);
        checkAuth();
    }, [userToken]);

    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>

            <Route path={"/"} element={<Layout/>}>

                <Route path="/home" element={<Home/>}/>

                <Route element={<PrivateRoute isAuthenticated={isAuthenticated}/>}>
                    <Route path="/profile" element={ <Profile/> } />
                    <Route path="/teams" element={ <Teams/> } />
                </Route>

            </Route>
        </Routes>
    );
}