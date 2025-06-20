// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.12.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.1/firebase-messaging-compat.js");

// 🔐 Firebase Config (yine .env dosyasından al)
firebase.initializeApp({
    apiKey: "AIzaSyA7383N7vCC9XfTCA7ufTgz6ddn9TA_Y2Y",
    authDomain: "e-vetdose.firebaseapp.com",
    projectId: "e-vetdose",
    messagingSenderId: "400755262885",
    appId: "1:400755262885:web:d1c264ad1bc823c8be944c"
});

// 🚀 messaging instance
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log("📦 Arka planda bildirim alındı:", payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: "/icon-192x192.png",
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});