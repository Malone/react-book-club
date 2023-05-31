import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {getFirestore} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBk0wudvzSc5tZsJ_xplQVY9o-C6_fglc4",
  authDomain: "test-book-hub.firebaseapp.com",
  projectId: "test-book-hub",
  storageBucket: "test-book-hub.appspot.com",
  messagingSenderId: "322716368110",
  appId: "1:322716368110:web:de65cc0711824be6d147ff",
  measurementId: "G-REZZDZJFWT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
