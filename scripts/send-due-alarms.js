#!/usr/bin/env node
import dotenv from "dotenv";
dotenv.config();

import connectToDB from "../mongodb.js";
import User from "../models/User.js"; // mongoose modelini al
import { sendToFCM } from "../fcm.js";

const sendDueAlarms = async () => {
    const now = Date.now();
    const range = 60000;

    await connectToDB(); // sadece bağlantıyı kur
    const users = await User.find({});

    for (const user of users) {
        if (!user.fcmToken || !user.alarms?.length) continue;

        const dueAlarms = user.alarms.filter((alarm) => {
            const alarmTime = new Date(alarm.alarmTime).getTime();
            return Math.abs(alarmTime - now) < range;
        });

        for (const user of users) {
            console.log("🎯 Kullanıcı kontrol ediliyor:", user.email || user._id);

            if (!user.fcmToken || !user.alarms || user.alarms.length === 0) continue;

            const dueAlarms = user.alarms.filter((alarm) => {
                const alarmTime = new Date(alarm.alarmTime).getTime();
                console.log("⏰ Alarm kontrolü:", alarmTime, "şimdi:", now);
                return Math.abs(alarmTime - now) < range;
            });

            for (const alarm of dueAlarms) {
                console.log(`📨 Bildirim gönderiliyor: ${alarm.message}`);

                await sendToFCM(user.fcmToken, {
                    title: "🔔 Alarm Zamanı!",
                    body: alarm.message,
                });
            }
        }
    }

    process.exit();
};

sendDueAlarms();