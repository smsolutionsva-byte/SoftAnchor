import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyApkIxptpR6oA8JLo7FKh3NzxCI-bV6szg",
  authDomain: "soft-anchor.firebaseapp.com",
  projectId: "soft-anchor",
  storageBucket: "soft-anchor.firebasestorage.app",
  messagingSenderId: "391447804066",
  appId: "1:391447804066:web:f3b7e41abf3c397d72bffb",
  measurementId: "G-D53M8DKEG5",
  databaseURL: "https://soft-anchor-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// Singleton init — safe for Next.js hot reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

// Realtime Database — for chat feature
export const rtdb = getDatabase(app);

// Analytics only in browser (not during SSR)
export const analyticsPromise = isSupported().then((yes) =>
  yes ? getAnalytics(app) : null
);

export default app;
