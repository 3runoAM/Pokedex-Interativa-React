import './App.css';
import {supabase} from './services/SupabaseClient.js';
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";

export default function App() {
    console.log('Supabase client:', supabase);

    return (
        <>
            {/*<Login/>*/}

            <Register/>
        </>
    );
}