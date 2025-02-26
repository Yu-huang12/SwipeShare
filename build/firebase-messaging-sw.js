importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDk3B6qZsRpedep_4fUDpViD2-pnP2oo24",
  authDomain: "swipeshares.firebaseapp.com",
  projectId: "swipeshares",
  storageBucket: "swipeshares.appspot.com",
  messagingSenderId: "72328664964",
  appId: "1:72328664964:web:55556aa1c7d629e3062fd1"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
}); 