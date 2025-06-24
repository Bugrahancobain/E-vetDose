import { NextResponse } from "next/server";
import connectToDB from "../../../../mongodb";
import User from "../../../../models/User";

function tryParseDate(dateStr) {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
}

export async function POST(req) {
    try {
        const payload = await req.json();
        const event = payload.meta?.event_name;
        const data = payload.data;

        if (!data || !data.attributes) {
            return NextResponse.json({ error: "Eksik veri" }, { status: 400 });
        }

        const attr = data.attributes;

        // 🎯 Sadece desteklenen event'lerde işlem yap
        if (!["subscription_created", "subscription_updated"].includes(event)) {
            return NextResponse.json({ message: "Event tipi işlenmiyor" }, { status: 200 });
        }

        const productId = attr.product_id;

        const mapping = {
            "556653": { plan: "basic", billing: "monthly" },
            "556667": { plan: "basic", billing: "yearly" },
            "556665": { plan: "enterprise", billing: "monthly" },
            "556669": { plan: "enterprise", billing: "yearly" },
            "556664": { plan: "pro", billing: "monthly" },
            "556668": { plan: "pro", billing: "yearly" }
        };

        const planInfo = mapping[productId];
        if (!planInfo) {
            return NextResponse.json({ error: "Ürün ID eşleşmedi." }, { status: 400 });
        }

        await connectToDB();
        const user = await User.findOne({ email: attr.user_email });

        if (!user) {
            return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
        }

        const startDate = tryParseDate(attr.created_at);
        const renewDate = tryParseDate(attr.renews_at);
        const endDate = tryParseDate(attr.ends_at); // null gelebilir

        if (!startDate) {
            return NextResponse.json({ error: "Başlangıç tarihi geçersiz" }, { status: 400 });
        }

        const eskiAbonelikBitiş = user.subscription?.subscriptionEnd;
        const yeniBaşlangıç = eskiAbonelikBitiş && eskiAbonelikBitiş > startDate ? eskiAbonelikBitiş : startDate;

        user.subscription = {
            status: attr.status || "active",
            plan: planInfo.plan,
            billingCycle: planInfo.billing,
            subscriptionStart: yeniBaşlangıç,
            subscriptionEnd: endDate ?? renewDate ?? null,
            subscriptionId: data.id,
            customerId: attr.customer_id,
            trialStart: null,
            trialEnd: tryParseDate(attr.trial_ends_at) ?? null,
        };

        await user.save();

        return NextResponse.json({ message: "Abonelik başarıyla güncellendi" }, { status: 200 });
    } catch (error) {
        console.error("Webhook hatası:", error.stack || error);
        return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
    }
}