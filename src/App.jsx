import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
// import {supabase} from './services/SupabaseClient.js';
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";


export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
}