import cron from "node-cron";
import User from "../models/User.js";
import { messaging } from "../firebaseAdmin.js";
import connectDB from "../mongodb.js";
import mongoose from "mongoose";
import { deleteAlarm } from "../api";


cron.schedule("* * * * *", async () => {
    await connectDB();
    const now = new Date();
    const hhmm = now.toTimeString().slice(0, 5); // örn: "14:30"
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    const users = await User.find({ "alarms.time": hhmm });

    for (const user of users) {
        const dueAlarms = user.alarms.filter((alarm) => {
            const [hour, minute] = alarm.time.split(":").map(Number);
            const alarmMinutes = hour * 60 + minute;
            return Math.abs(alarmMinutes - nowMinutes) <= 5;
        });

        let hasChanges = false;

        for (const alarm of dueAlarms) {
            if (!user.fcmToken) continue;

            await messaging.send({
                token: user.fcmToken,
                notification: {
                    title: "🔔 Alarm Zamanı!",
                    body: `${alarm.patientName}: ${alarm.description}`,
                    icon: "https://e-vet-dose.vercel.app/icon-192x192.png",
                },
            });

            if (!alarm.isDaily) {
                user.alarms = user.alarms.filter(
                    (a) => a._id.toString() !== mongoose.Types.ObjectId(alarm._id).toString()
                );
                await deleteAlarm(user.uid, alarm._id);
                loadAlarms();

            } else {
                console.log("🔁 Günlük alarm tekrar edecek:", alarm._id);
            }
        }

        // 🔄 Tüm alarmlar işlendiğinde bir kez kayıt et
        if (hasChanges) {
            await user.save();
            console.log("💾 Kullanıcı kaydedildi:", user.uid);
        }
    }

    console.log("✅ Alarm kontrolü tamamlandı:", hhmm);
});