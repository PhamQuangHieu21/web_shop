import firebase from "firebase/compat/app"
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    sendPasswordResetEmail,
    getAuth,
    updatePassword
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyASDwRrY7L9FBHuO3KvWI1VVXl9wgrCLew",
    authDomain: "shop-be-6b0ff.firebaseapp.com",
    projectId: "shop-be-6b0ff",
    storageBucket: "shop-be-6b0ff.firebasestorage.app",
    messagingSenderId: "797335310322",
    appId: "1:797335310322:web:4f663d6c39d322e83ba56b",
    measurementId: "G-WV76F3TJPB",
    databaseURL: "https://shop-be-6b0ff-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

firebase.initializeApp(firebaseConfig);

const auth = getAuth();

export {
    auth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    sendPasswordResetEmail,
    updatePassword
};