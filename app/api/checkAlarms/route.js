// app/api/checkAlarms/route.js
import { NextResponse } from "next/server";
import connectToDB from "../../../mongodb"; // kendi yolunu ayarla
import User from "../../../models/User";    // kendi yolunu ayarla
import { messaging } from "../../../firebaseAdmin"; // kendi yolunu ayarla

export async function GET() {
    try {
        await connectToDB();
        const now = new Date();
        const hhmm = now.toTimeString().slice(0, 5); // "14:30" gibi

        const users = await User.find({ "alarms.time": hhmm });

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