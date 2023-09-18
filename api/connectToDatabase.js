import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2Squim3XPlaqIlbV4lNb-Nx6Qz5JjNNQ",
  authDomain: "attendance-record-app-7e8e5.firebaseapp.com",
  projectId: "attendance-record-app-7e8e5",
  storageBucket: "attendance-record-app-7e8e5.appspot.com",
  messagingSenderId: "235122994474",
  appId: "1:235122994474:web:2ab70ea249ca23ba9a8253",
  databaseURL:
    "https://attendance-record-app-7e8e5-default-rtdb.europe-west1.firebasedatabase.app",
};
// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);

//get Database
const database = getDatabase(appFirebase);

export default database;
