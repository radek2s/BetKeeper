/* eslint-disable no-console */
// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = JSON.parse(new URL(location).searchParams.get("config"))

console.log("Service worker config", firebaseConfig)
if (firebaseConfig) {
    firebase.initializeApp(firebaseConfig)
    const messaging = firebase.messaging();
    messaging.onBackgroundMessage(({ notification: { title, body, image } }) => {
        self.registration.showNotification(title, { body });
    });
}
