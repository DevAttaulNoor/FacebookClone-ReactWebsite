import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import firebase from "firebase/compat/app";

const firebaseConfig = firebase.initializeApp({
    apiKey: "AIzaSyA9lA6YzItci9gZgid3to3zEYL10U04C5o",
    authDomain: "react-facebook-clone-e7bc0.firebaseapp.com",
    projectId: "react-facebook-clone-e7bc0",
    storageBucket: "react-facebook-clone-e7bc0.appspot.com",
    messagingSenderId: "915537057768",
    appId: "1:915537057768:web:50cf51cdd2fa935fe8765d",
});

const auth = firebase.auth();
const db = firebaseConfig.firestore();
const storage = firebase.storage();

export { auth, db, storage };
