// #FIREBASEAUTH Firebase config for frontend

import { initializeApp } from "firebase/app";
// import {getAnalytics} from "firebase/analytics";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

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

//Google Authentication
const popUpSignIn = signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
//Google Authentication

export { signUp, signIn, auth, db, popUpSignIn };
