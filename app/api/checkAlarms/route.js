// app/api/checkAlarms/route.js
import { NextResponse } from "next/server";
import connectToDB from "../../../mongodb"; // kendi yolunu ayarla
import User from "../../../models/User";    // kendi yolunu ayarla
import { messaging } from "../../../firebaseAdmin"; // kendi yolunu ayarla

export async function GET() {
    console.log("🚀 /api/checkAlarms çağrıldı");
    try {
        await connectToDB();
        console.log("✅ DB bağlantısı kuruldu");

        // Şu anki saat (Türkiye saatiyle)
        const now = new Date();
        const istNow = new Date(
            now.toLocaleString("en-US", { timeZone: "Europe/Istanbul" })
        );
        const nowMinutes = istNow.getHours() * 60 + istNow.getMinutes();

        console.log("⏳ Alarm zamanı kontrol ediliyor (dakika):", nowMinutes);

        const users = await User.find();
        console.log("👥 Kullanıcı sayısı:", users.length);

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
                    },
                });

                if (!alarm.isDaily) {
                    user.alarms = user.alarms.filter(
                        (a) => a._id.toString() !== alarm._id.toString()
                    );
                    hasChanges = true;
                    console.log("🗑 Tek seferlik alarm silindi:", alarm._id);
                } else {
                    console.log("🔁 Günlük alarm tekrar edecek:", alarm._id);
                }
            }

            if (hasChanges) {
                await user.save();
                console.log("💾 Kullanıcı kaydedildi:", user.uid);
            }
        }

        return NextResponse.json({ success: true, checkedAt: nowMinutes });
    } catch (error) {
        console.error("⛔ Alarm kontrolü hatası:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}