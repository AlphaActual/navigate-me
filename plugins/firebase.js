// firebase plugin

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import "firebase/auth";
import "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAH5ceb4XbHesiS81aWFKvu1It1ibXCLZ8",
  authDomain: "navigate-me-8f648.firebaseapp.com",
  projectId: "navigate-me-8f648",
  storageBucket: "navigate-me-8f648.appspot.com",
  messagingSenderId: "419500803195",
  appId: "1:419500803195:web:431d7dced4f71ac1d0cede",
  measurementId: "G-ZRZ4WJF6RM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

///

export { app, auth };
