import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBH7tlhqkz6ZqYMTrcPRM56Np7XeYXJClo",
  authDomain: "pokerplanning-93247.firebaseapp.com",
  projectId: "pokerplanning-93247",
  storageBucket: "pokerplanning-93247.appspot.com",
  messagingSenderId: "245178779699",
  appId: "1:245178779699:web:c614940baeff0430013b46",
  measurementId: "G-VP5RZFCMDB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase()