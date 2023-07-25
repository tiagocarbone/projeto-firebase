import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'




const firebaseConfig = {
    apiKey: "AIzaSyAzpYI8-JfC-ynbPVPECvTtfkQ1MEN8UZ8",
    authDomain: "curso-f19e9.firebaseapp.com",
    projectId: "curso-f19e9",
    storageBucket: "curso-f19e9.appspot.com",
    messagingSenderId: "950387233379",
    appId: "1:950387233379:web:1adfb13f2205a756489e56",
    measurementId: "G-1VC12KXSY5"
};

const firebaseApp = initializeApp(firebaseConfig)

const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)

export { db, auth }