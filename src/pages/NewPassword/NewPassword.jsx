import style from './NewPassword.module.css';
import {useEffect, useState} from "react";
import {supabase} from "../../services/SupabaseClient";
import {useToast} from "../../provider/ToastProvider";
import {useNavigate} from "react-router-dom";

export default function NewPassword() {
    const [authorized, setAuthorized] = useState(null);
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const {showToast} = useToast();

    useEffect(() => {
        supabase.auth.onAuthStateChange((event, session) => {
            if (event === "PASSWORD_RECOVERY") {
                setAuthorized(true);
            } else {
                setAuthorized(false);
            }
        })
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password || password.trim().length < 6) {
            showToast('Invalid password. Try again');
            return;
        }

        try {
            const {_, error} = await supabase.auth.updateUser({
                password: password,
            });

            if (error) throw error;

            console.log('Password updated successfully');
            showToast('Password updated successfully');

            await supabase.auth.signOut();
            navigate('/login');
        } catch (err) {
            console.error('Error updating password:', err.message);
            showToast('Error updating password');
        }
    }

    if (authorized === null) return <div>Loading...</div>;

    return (
        <section className={`${style.newPasswordContainer} flex-column flex-center smallPadding`}>
            <form className={`${style.newPasswordContainer} flex-column flex-center smallPadding`}>

                <div className={`flex-column smallGap`}>
                    <label className={style.title}>New Password</label>
                    <input value={password} onChange={(e) => setPassword(e.target.value)}
                           className={style.input}
                           type="password" name="newPassword" required/>
                </div>

                <button className={`button`} onClick={(e) => handleSubmit(e)}>Save</button>
            </form>
        </section>
    );
}