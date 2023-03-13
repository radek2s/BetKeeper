// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
// var firebaseConfig = {

// };

// firebase.initializeApp(firebaseConfig);
// const messaging = firebase.messaging();

// console.log(localStorage.getItem("conf-server"))

// channel.onmessage = (message) => {
//     console.log(message)
// }
self.addEventListener('message', (event) => {
    console.log(event)
    if (event.data) {

    }
})

