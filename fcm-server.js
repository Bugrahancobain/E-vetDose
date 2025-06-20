// lib/fcm-server.js
import { google } from "googleapis";

// 🔐 Sadece server-side için geçerli
const SCOPES = ["https://www.googleapis.com/auth/firebase.messaging"];

let accessTokenCache = null;
let tokenExpiry = 0;

export async function getAccessToken() {
    const jwtClient = new google.auth.JWT({
        email: process.env.GOOGLE_CLIENT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        scopes: SCOPES,
    });

    // 🔁 Cache kontrolü
    if (accessTokenCache && Date.now() < tokenExpiry) {
        return accessTokenCache;
    }

    const tokens = await jwtClient.authorize();
    accessTokenCache = tokens.access_token;
    tokenExpiry = Date.now() + tokens.expiry_date;

    return accessTokenCache;
}

export async function sendToFCM(fcmToken, notification) {
    const accessToken = await getAccessToken();
    const projectId = process.env.GOOGLE_PROJECT_ID;

    const messagePayload = {
        message: {
            token: fcmToken,
            notification,
            webpush: {
                headers: {
                    Urgency: "high",
                },
                notification: {
                    icon: "/icons/icon-192x192.png",
                },
            },
        },
    };

    const res = await fetch(`https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(messagePayload),
    });

    const data = await res.json();

    if (!res.ok) {
        console.error("❌ FCM gönderim hatası:", data);
        throw new Error("Bildirim gönderilemedi.");
    }

    return data;
}