import './App.css';
import {Route, Routes} from "react-router-dom";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import {useEffect, useState} from "react";
import Home from "./pages/Home/Home";
import Authentication from "./services/Authentication";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import MenuLayout from "./layouts/MenuLayout";
import Profile from "./pages/Profile/Profile";
import Teams from "./pages/Teams/Teams";
import Unauthorized from "./pages/Unauthorized/Unauthorized";
import PokemonDetails from "./pages/PokemonDetails/PokemonDetails";
import NewTeam from "./pages/NewTeam/NewTeam";
import NewPassword from "./pages/NewPassword/NewPassword";

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


    console.log("O usuário está autenticado?", isAuthenticated ? "Sim" : "Não");

    if (loading) return <div className={`loading`}>Carregando...</div>;

    return (
        <Routes>
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated}/>} />
            <Route path="/register" element={<Register/>}/>

            <Route path={"/"} element={<MenuLayout/>}>
                <Route path="/" element={<Home/>}/>
                <Route path="/home" element={<Home/>}/>
                <Route path="/unauthorized" element={<Unauthorized />}/>
                <Route path="/pokemonDetails/:id" element={<PokemonDetails />} />
                <Route path="/newPassword" element={<NewPassword />} />

                <Route element={<PrivateRoute isAuthenticated={isAuthenticated}/>}>
                    <Route path="/profile" element={ <Profile/> } />
                    <Route path="/teams" element={ <Teams/> } />
                    <Route path="/teams/new" element={ <NewTeam /> } />
                </Route>
            </Route>
        </Routes>
    );
}