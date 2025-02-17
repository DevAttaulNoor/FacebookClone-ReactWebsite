import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAVTKa2YbN16CUDucwiCQHvFEQ0Gwj1Xz8",
    authDomain: "fb-clone-v2-47a42.firebaseapp.com",
    projectId: "fb-clone-v2-47a42",
    storageBucket: "fb-clone-v2-47a42.firebasestorage.app",
    messagingSenderId: "706668170631",
    appId: "1:706668170631:web:74096b8dd1f73658055722"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);