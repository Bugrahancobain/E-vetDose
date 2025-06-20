import { NextResponse } from "next/server";
import connectToDB from "../../../../mongodb";
import User from "../../../../models/User";

export async function POST(req) {
    const body = await req.json();

    // Hem userId hem uid olasılıklarını kontrol et
    const uid = body.uid || body.userId;
    const fcmToken = body.fcmToken || body.token;

    console.log("🔥 FCM Token API çağrısı:", { uid, fcmToken });

    if (!uid || !fcmToken) {
        console.log("🚨 Eksik veri:", { uid, fcmToken });
        return NextResponse.json({ error: "uid ve fcmToken zorunlu" }, { status: 400 });
    }

    try {
        await connectToDB();
        const user = await User.findOne({ uid });

        if (!user) {
            console.log("❌ Kullanıcı bulunamadı:", uid);
            return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
        }

        user.fcmToken = fcmToken;
        await user.save();

        console.log("✅ FCM token başarıyla kaydedildi");
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("❌ FCM token kaydetme hatası:", error);
        return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
    }
}