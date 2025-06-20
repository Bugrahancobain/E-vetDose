import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDB from "../../../../mongodb";
import User from "../../../../models/User";

export async function DELETE(req) {
    const body = await req.json();
    const { uid, alarmId } = body;

    try {
        await connectToDB();
        await User.updateOne(
            { uid },
            { $pull: { alarms: { _id: new mongoose.Types.ObjectId(alarmId) } } }
        );
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Alarm silme hatası:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}