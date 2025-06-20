"use client";
import { useEffect } from "react";
import { registerFCMToken } from "../../../fcm-client.js";
import { auth } from "../../../firebase";

export default function Dashboard() {
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                registerFCMToken(user.uid); // token gönderimini yapar
            }
        });

        return () => unsubscribe();
    }, []);

    return <div>Dashboard</div>;
}