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
        // app/api/checkAlarms/route.js

        const now = new Date();
        const hhmm = now.toLocaleTimeString("tr-TR", {
            timeZone: "Europe/Istanbul",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });

        console.log("⏳ Alarm zamanı kontrol ediliyor:", hhmm);
        const users = await User.find({ "alarms.time": hhmm });
        console.log("👥 Kullanıcı sayısı:", users.length);

        for (const user of users) {
            const dueAlarms = user.alarms.filter((a) => a.time === hhmm);

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
                    console.log("🔁 Günlük alarm çalındı, tekrar edecek:", alarm._id);
                }
            }

            if (hasChanges) await user.save();
        }

        return NextResponse.json({ success: true, time: hhmm });
    } catch (error) {
        console.error("⛔ Alarm kontrolü hatası:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}