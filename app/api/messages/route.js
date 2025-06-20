import connectToDB from "../../../mongodb";
import User from "../../../models/User";
import { NextResponse } from "next/server";

// 📥 GET: Kullanıcının mesaj geçmişini al
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const uid = searchParams.get("userId"); // Auth'dan gelen uid

        if (!uid) {
            return NextResponse.json({ error: "UID eksik" }, { status: 400 });
        }

        await connectToDB();

        const user = await User.findOne({ uid });

        if (!user) {
            return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
        }

        const messages = user.messages || [];

        return NextResponse.json({ messages });
    } catch (error) {
        console.error("❌ GET /api/messages hatası:", error);
        return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
    }
}

// 📤 POST: Mesaj kaydet
export async function POST(req) {
    try {
        const { userId: uid, message } = await req.json();

        if (!uid || !message) {
            return NextResponse.json({ error: "Eksik veri" }, { status: 400 });
        }

        await connectToDB();

        const user = await User.findOne({ uid });

        if (!user) {
            return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
        }

        user.messages.unshift(message); // sona değil başa ekle
        user.messages = user.messages.slice(0, 20); // sadece son 20 mesaj

        await user.save();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("❌ POST /api/messages hatası:", error);
        return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
    }
}