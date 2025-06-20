import { getToken } from "firebase/messaging";
import { messaging } from "./firebase"; // doğru yol olduğundan emin ol

export const registerFCMToken = async (userId) => {
    console.log("🚀 registerFCMToken fonksiyonu çağrıldı:", userId);

    try {
        const token = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
            serviceWorkerRegistration: await navigator.serviceWorker.ready,
        });

        if (!token) {
            console.warn("⚠️ FCM token alınamadı, null döndü");
        } else {
            console.log("✅ Token:", token);
        }
        console.log(process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY)

        console.log("✅ FCM token alındı:", token);

        const res = await fetch("/api/fcm/token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uid: userId, fcmToken: token }), // burada düzelt
        });

        const result = await res.json();
        console.log("📨 FCM token backend'e gönderildi:", result);

    } catch (err) {
        console.error("❌ FCM token alınamadı:", err);
    }
};