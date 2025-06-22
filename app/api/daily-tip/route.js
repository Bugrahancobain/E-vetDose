import { NextResponse } from 'next/server';
import connectToDB from '../../../mongodb';
import Tip from '../../../models/Tip'; // daily tip modeli

export async function GET() {
    try {
        await connectToDB();


        const tip = await Tip.findOne().sort({ _id: -1 }); // ✅ _id ile sırala

        if (!tip) {
            return NextResponse.json({ tip: "Bugünlük bilgi bulunamadı." }, { status: 200 });
        }

        return NextResponse.json({ tip: tip.tip }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
    }
}