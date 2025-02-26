import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { updateDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDk3B6qZsRpedep_4fUDpViD2-pnP2oo24",
  authDomain: "swipeshares.firebaseapp.com",
  projectId: "swipeshares",
  storageBucket: "swipeshares.appspot.com",
  messagingSenderId: "72328664964",
  appId: "1:72328664964:web:55556aa1c7d629e3062fd1",
  measurementId: "G-R20HCHC86Y"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
const messaging = getMessaging(app);

export const requestNotificationPermission = async (currentUser) => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted' && currentUser) {
      const token = await getToken(messaging, {
        vapidKey: 'YOUR_VAPID_KEY'
      });
      
      // Save this token to the user's document in Firestore
      await updateDoc(doc(db, 'users', currentUser.uid), {
        fcmToken: token
      });
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
  }
};

// Handle foreground messages
onMessage(messaging, (payload) => {
  new Notification(payload.notification.title, {
    body: payload.notification.body
  });
}); 