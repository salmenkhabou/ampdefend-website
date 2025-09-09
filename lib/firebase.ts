import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getAnalytics } from "firebase/analytics"
import { getDatabase } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyBMqMt9jb-pMU1hqYemHA6bf6CKFFLd2gU",
  authDomain: "ampdefender-9bf8e.firebaseapp.com",
  databaseURL: "https://ampdefender-9bf8e-default-rtdb.firebaseio.com",
  projectId: "ampdefender-9bf8e",
  storageBucket: "ampdefender-9bf8e.firebasestorage.app",
  messagingSenderId: "862045725600",
  appId: "1:862045725600:web:ae53be7dcfa1d86437bac5",
  measurementId: "G-CNY1T1V18T",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const realtimeDb = getDatabase(app)

// Initialize Analytics (only in browser)
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null

export default app
