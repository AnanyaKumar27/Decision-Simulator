import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBlgdSJNnvbSJPzf64SkfVprCBbPATjM28",
  authDomain: "decision-simulator.firebaseapp.com",
  projectId: "decision-simulator",
  storageBucket: "decision-simulator.firebasestorage.app",
  messagingSenderId: "924484356570",
  appId: "1:924484356570:web:a4c96be7a9a3163b52d8e3",
  measurementId: "G-M84K5RR9DC"
};

export const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean)

export const app = hasFirebaseConfig ? initializeApp(firebaseConfig) : null
export const auth = app ? getAuth(app) : null
export const db = app ? getFirestore(app) : null
