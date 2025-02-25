import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA9lA6YzItci9gZgid3to3zEYL10U04C5o",
    authDomain: "react-facebook-clone-e7bc0.firebaseapp.com",
    projectId: "react-facebook-clone-e7bc0",
    storageBucket: "react-facebook-clone-e7bc0.appspot.com",
    messagingSenderId: "915537057768",
    appId: "1:915537057768:web:50cf51cdd2fa935fe8765d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
export const storage = getStorage(app); 