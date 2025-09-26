import './App.css';
import {supabase} from './services/SupabaseClient.js';
import Login from './pages/Login.jsx';

export default function App() {
    console.log('Supabase client:', supabase);

    return (
        <>
            <Login></Login>
        </>
    );
}