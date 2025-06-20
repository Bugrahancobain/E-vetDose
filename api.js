export async function sendMessageToChatGPT(prompt) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        }),
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error("OpenAI API Error:", errorText);
        throw new Error(`OpenAI API çağrısı başarısız oldu. Kod: ${res.status}`);
    }

    const data = await res.json();
    if (!data.choices || data.choices.length === 0) {
        throw new Error("OpenAI yanıtı geçersiz: choices dizisi boş.");
    }

    return data.choices[0].message.content;
}

const toBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

export async function uploadImageToGridFS(file, userId) {
    const base64Image = await toBase64(file);

    const res = await fetch("/api/uploadImageBase64", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userId,
            fileName: file.name,
            base64Image
        }),
    });

    if (!res.ok) throw new Error("Yükleme başarısız");

    const data = await res.json();
    return data.url; // Görselin Base64 hali
}

export async function saveMessage(userId, message) {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, message }),
    });
}

export async function fetchMessageHistory(userId) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/messages?userId=${userId}`);
    const data = await res.json();
    return data.messages;
}

import { getToken } from "firebase/messaging";
import { messaging } from "./firebase"; // firebase-messaging init edilen dosya

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

// Alarmları getir (GET /api/alarms)
export const fetchAlarms = async (uid) => {
    const res = await fetch(`/api/alarms?uid=${uid}`);
    if (!res.ok) throw new Error("Alarmlar çekilemedi");
    return await res.json();
};

export async function saveAlarm(uid, alarmData) {
    const res = await fetch("/api/alarms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, ...alarmData }),
    });

    if (!res.ok) {
        throw new Error("Alarm kaydedilemedi");
    }

    return await res.json();
}

export async function deleteAlarm(uid, alarmId) {
    const res = await fetch("/api/alarms/delete", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid, alarmId }),
    });

    const data = await res.json();
    return data;
}