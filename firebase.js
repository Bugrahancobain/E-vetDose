// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging, onMessage } from "firebase/messaging";

// 🔐 .env üzerinden config
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 🔥 Initialize
const app = initializeApp(firebaseConfig);

// 📌 Modüller
const auth = getAuth(app);
const messaging = typeof window !== "undefined" ? getMessaging(app) : null;

// 📱 Mobil cihaz tespiti
const isMobile = () => {
    if (typeof window === "undefined") return false;
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};

// 🔔 Bildirim mesajı geldiğinde tetiklenir
if (typeof window !== "undefined" && messaging) {
    onMessage(messaging, (payload) => {
        console.log("📩 Web bildirimi alındı:", payload);

        // Bildirimi göster
        if (Notification.permission === "granted") {
            new Notification(payload.notification.title, {
                body: payload.notification.body,
                icon: "/icon-192x192.png",
            });

            // 🔊 Mobilde ses çal
            if (isMobile()) {
                const audio = new Audio("/alarm.mp3");
                audio.play().catch((err) => {
                    console.warn("🔇 Ses çalınamadı:", err.message);
                });
            }
        }
    });
}

export { auth, messaging };