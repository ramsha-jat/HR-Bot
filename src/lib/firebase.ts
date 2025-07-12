// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration (get this from Firebase Project Settings)
const firebaseConfig = {
    apiKey: "AIzaSyB6HkcJQPforLuM7BG8LW-tj19M67umt2w",
    authDomain: "first-cedar-454204-t0.firebaseapp.com",
    projectId: "first-cedar-454204-t0",
    storageBucket: "first-cedar-454204-t0.firebasestorage.app",
    messagingSenderId: "847834075953",
    appId: "1:847834075953:web:37410a05aacbd10df01610",
    measurementId: "G-LFQM2QNZ3K"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app)