import { NextResponse } from "next/server";
import connectToDB from "../../../mongodb";
import User from "../../../models/User";

export async function GET(req) {
    try {
        await connectToDB();

        const { searchParams } = new URL(req.url);
        const uid = searchParams.get('uid');

        if (!uid) {
            return NextResponse.json({ error: 'UID eksik' }, { status: 400 });
        }

        const user = await User.findOne({ uid });

        if (!user || !user.alarms) {
            return NextResponse.json({ alarms: [] }, { status: 200 });
        }

        return NextResponse.json({ alarms: user.alarms }, { status: 200 });
    } catch (error) {
        console.error('API hata:', error);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}


export async function POST(req) {
    const body = await req.json();
    const { uid, patientName, description, time, isDaily } = body;

    try {
        await connectToDB();

        const now = new Date();
        const [hour, minute] = time.split(":");
        const alarmTime = new Date(now.setHours(hour, minute, 0, 0));

        const user = await User.findOne({ uid });
        if (!user) {
            return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
        }

        user.alarms.push({ patientName, description, time, isDaily, alarmTime });
        await user.save();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Alarm kaydetme hatası:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}