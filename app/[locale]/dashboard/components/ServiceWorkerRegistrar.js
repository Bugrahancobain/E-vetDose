"use client";
import { useEffect } from "react";
import { messaging } from "../../../../firebase";
import { getToken } from "firebase/messaging";
import { auth } from "../../../../firebase"; // auth eklenmeli
import { registerFCMToken } from "../../../../fcm-client";

export default function ServiceWorkerRegistrar() {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register("/firebase-messaging-sw.js")
                .then((registration) => {
                    console.log("✅ SW registered");

                    getToken(messaging, {
                        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
                        serviceWorkerRegistration: registration,
                    })
                        .then(async (currentToken) => {
                            if (currentToken) {
                                console.log("✅ FCM Token:", currentToken);

                                const user = auth.currentUser;
                                if (user) {
                                    await registerFCMToken(user.uid, currentToken);
                                } else {
                                    console.warn("❗ Kullanıcı oturumu bulunamadı.");
                                }
                            } else {
                                console.warn("❗ Token yok, izin verilmemiş olabilir.");
                            }
                        })
                        .catch((err) => {
                            console.error("❌ FCM token alınamadıı:", err);
                        });
                })
                .catch((err) => {
                    console.error("SW register failed", err);
                });
        }
    }, []);

    return null;
}