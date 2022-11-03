// From: Firebase getting started

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBdA61PS6InhUpvTMlB92oT5xyIkzP1j2E",
  authDomain: "decoratory-8c1e9.firebaseapp.com",
  projectId: "decoratory-8c1e9",
  storageBucket: "decoratory-8c1e9.appspot.com",
  messagingSenderId: "869499159209",
  appId: "1:869499159209:web:d182735bf259edacf29fb8",
  measurementId: "G-0BE597H58M"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
