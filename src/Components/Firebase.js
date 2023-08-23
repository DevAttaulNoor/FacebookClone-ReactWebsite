// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = firebase.initializeApp({
    apiKey: "AIzaSyDIcQRNI5-u47uNipNeSig3RMOCYTNxNkk",
    authDomain: "facebook-clone-d6f46.firebaseapp.com",
    projectId: "facebook-clone-d6f46",
    storageBucket: "facebook-clone-d6f46.appspot.com",
    messagingSenderId: "58732281846",
    appId: "1:58732281846:web:ee1d930a5d8c2dca5f51d7",
    measurementId: "G-QNPL71KKSS"
});

const auth = firebase.auth();
const provider = new firebase.auth.FacebookAuthProvider();

export {auth, provider}