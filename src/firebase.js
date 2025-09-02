import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyCFNIlymNWxmOOp-TrHgfujLhrTbyD9H98",
    authDomain: "pokedex-7de54.firebaseapp.com",
    projectId: "pokedex-7de54",
    storageBucket: "pokedex-7de54.firebasestorage.app",
    messagingSenderId: "682108061093",
    appId: "1:682108061093:web:42a1f5b208c749edf3944c"
};

const app = initializeApp(firebaseConfig);

export default app;