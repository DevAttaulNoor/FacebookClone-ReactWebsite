// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, FacebookAuthProvider } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyDIcQRNI5-u47uNipNeSig3RMOCYTNxNkk",
    authDomain: "facebook-clone-d6f46.firebaseapp.com",
    projectId: "facebook-clone-d6f46",
    storageBucket: "facebook-clone-d6f46.appspot.com",
    messagingSenderId: "58732281846",
    appId: "1:58732281846:web:ee1d930a5d8c2dca5f51d7",
    measurementId: "G-QNPL71KKSS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new FacebookAuthProvider();

export { auth, provider }