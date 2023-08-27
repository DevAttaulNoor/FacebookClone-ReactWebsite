// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import "firebase/storage"

const firebaseConfig = firebase.initializeApp({
    apiKey: "AIzaSyA9lA6YzItci9gZgid3to3zEYL10U04C5o",
    authDomain: "react-facebook-clone-e7bc0.firebaseapp.com",
    projectId: "react-facebook-clone-e7bc0",
    storageBucket: "react-facebook-clone-e7bc0.appspot.com",
    messagingSenderId: "915537057768",
    appId: "1:915537057768:web:50cf51cdd2fa935fe8765d"
});

const auth = firebase.auth();
const provider = new firebase.auth.FacebookAuthProvider();
const db = firebaseConfig.firestore();
const storage = firebase.storage();

export {auth, provider, db, storage}