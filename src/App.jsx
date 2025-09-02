import './App.css';
import app from './firebase';

export default function App() {
    console.log('App is running!', app);
    return (
        <div className="App">
            <h1>Hello World!</h1>
        </div>
    );
}