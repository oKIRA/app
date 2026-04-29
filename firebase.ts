"use client";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1VLuHJNx1-NdOu-UC888BqL6ri4IOwv8",
  authDomain: "copa-alianca.firebaseapp.com",
  projectId: "copa-alianca",
  storageBucket: "copa-alianca.firebasestorage.app",
  messagingSenderId: "390551922538",
  appId: "1:390551922538:web:081314b8a0d81864d36713",
  measurementId: "G-XV835R7Q84"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, analytics };