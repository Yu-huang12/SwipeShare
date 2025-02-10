import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDk3B6qZsRpedep_4fUDpViD2-pnP2oo24",
  authDomain: "swipeshares.firebaseapp.com",
  projectId: "swipeshares",
  storageBucket: "swipeshares.firebasestorage.app",
  messagingSenderId: "72328664964",
  appId: "1:72328664964:web:55556aa1c7d629e3062fd1",
  measurementId: "G-R20HCHC86Y"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app); 