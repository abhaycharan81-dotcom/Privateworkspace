// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRbwUVVgfNncezcWT2Q-jrkpuxtk1ryZM",
  authDomain: "private-workspace-1e4c9.firebaseapp.com",
  databaseURL: "https://private-workspace-1e4c9-default-rtdb.firebaseio.com",
  projectId: "private-workspace-1e4c9",
  storageBucket: "private-workspace-1e4c9.firebasestorage.app",
  messagingSenderId: "175779407161",
  appId: "1:175779407161:web:4949882fc31cf31eebb4e8",
  measurementId: "G-LZ7V9PLB41",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const database = getDatabase(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, analytics, database, auth, googleProvider };


