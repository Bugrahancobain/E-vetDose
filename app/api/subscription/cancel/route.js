import { NextResponse } from "next/server";
import connectToDB from "../../../../mongodb";
import User from "../../../../models/User";

// ENV'den API anahtarını al
const LEMON_API_KEY = process.env.LEMON_ADMIN_API_KEY;

export async function POST(req) {
    try {
        const { email } = await req.json();

        await connectToDB();
        const user = await User.findOne({ email });

        if (!user || !user.subscription?.subscriptionId) {
            return NextResponse.json({ error: "Abonelik bilgisi bulunamadı." }, { status: 404 });
        }

        const subscriptionId = user.subscription.subscriptionId;

        // ❗DELETE yerine PATCH yapılmalı
        const response = await fetch(`https://api.lemonsqueezy.com/v1/subscriptions/${subscriptionId}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${LEMON_API_KEY}`,
                "Content-Type": "application/vnd.api+json",
                Accept: "application/vnd.api+json",
            },
            body: JSON.stringify({
                data: {
                    type: "subscriptions",
                    id: subscriptionId.toString(),
                    attributes: {
                        cancel_at_end: true
                    }
                }
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Lemon Squeezy API hatası:", errorData);
            return NextResponse.json({ error: "Lemon Squeezy API hatası" }, { status: 500 });
        }

        // MongoDB'yi hemen temizlemek yerine 'cancelled' statüsü ile güncelle
        user.subscription.status = "cancelled";
        await user.save();

        return NextResponse.json({
            message: "Abonelik iptal edildi, ancak dönem sonuna kadar devam edecek."
        }, { status: 200 });

    } catch (error) {
        console.error("İptal hatası:", error);
        return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
    }
}