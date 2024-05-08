// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBC-enU6y3JOCbUOoO4e4xm8Gkh_Ex6q9o",
  authDomain: "eduvisorai.firebaseapp.com",
  projectId: "eduvisorai",
  storageBucket: "eduvisorai.appspot.com",
  messagingSenderId: "11082023871",
  appId: "1:11082023871:web:a3ecc004ecaa1a138e170a",
  measurementId: "G-7VLM8RZ504",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { app, auth, analytics };
