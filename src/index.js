import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import { initializeApp } from "firebase/app"
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const provider = new GoogleAuthProvider();



const firebaseConfig = {
  apiKey: "AIzaSyBkkYxjexlrTcCQSSsRurhTxDi947oGRjc",
  authDomain: "reservation-calendar-bethke.firebaseapp.com",
  projectId: "reservation-calendar-bethke",
  storageBucket: "reservation-calendar-bethke.appspot.com",
  messagingSenderId: "894423747632",
  appId: "1:894423747632:web:716bd037663050aff3b1f5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth();
signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });



ReactDOM.render(
  <React.StrictMode>
    <App db ={db}/>
  </React.StrictMode>,
  document.getElementById("root")
);
