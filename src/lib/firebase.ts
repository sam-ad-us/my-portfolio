import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  "projectId": "studio-1619180194-ebaaf",
  "appId": "1:511615589972:web:3cdd5a9964a81ab6d417c1",
  "storageBucket": "studio-1619180194-ebaaf.firebasestorage.app",
  "apiKey": "AIzaSyCz8At8PGJ5mVAD4C2cwygLhCefs_i8vLg",
  "authDomain": "studio-1619180194-ebaaf.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "511615589972"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
