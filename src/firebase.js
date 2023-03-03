import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: "chat-25090.firebaseapp.com",
  projectId: "chat-25090",
  storageBucket: "chat-25090.appspot.com",
  messagingSenderId: "591207488553",
  appId: "1:591207488553:web:0f7d55695110f1e539d038"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()
