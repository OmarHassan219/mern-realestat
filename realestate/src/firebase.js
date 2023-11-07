// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-9ef86.firebaseapp.com",
  projectId: "mern-estate-9ef86",
  storageBucket: "mern-estate-9ef86.appspot.com",
  messagingSenderId: "234793375926",
  appId: "1:234793375926:web:d9b3cf4bdbeda1231c2e17"
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);