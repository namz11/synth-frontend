// #FIREBASEAUTH Firebase config for frontend
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjz8i8HhZHoUxF7tsDsDSDNHWPblYV_Y4",
  authDomain: "synth-6f232.firebaseapp.com",
  databaseURL: "https://synth-6f232-default-rtdb.firebaseio.com",
  projectId: "synth-6f232",
  storageBucket: "synth-6f232.appspot.com",
  messagingSenderId: "34010029822",
  appId: "1:34010029822:web:5322c56c22cf9616978faf",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize other Firebase services
// const analytics = getAnalytics(app);
const signIn = signInWithEmailAndPassword;
const signUp = createUserWithEmailAndPassword;
const auth = getAuth(app);
const db = getFirestore(app);

const provider = new GoogleAuthProvider();

export { signUp, signIn, auth, db };
