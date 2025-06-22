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

        const productId = data.attributes.product_id;
        const variantId = data.attributes.variant_id;

        const mapping = {
            "556653": { plan: "basic", billing: "monthly" },       // BasicPlanMontly
            "556667": { plan: "basic", billing: "yearly" },        // BasicPlanYearly

            "556665": { plan: "enterprise", billing: "monthly" },  // EnterpricePlanMontly
            "556669": { plan: "enterprise", billing: "yearly" },   // EnterpricePlanYearly

            "556664": { plan: "pro", billing: "monthly" },         // ProfessionalPlanMontly
            "556668": { plan: "pro", billing: "yearly" }           // ProfessionalPlanYearly
        };

        const planInfo = mapping[productId];
        if (!planInfo) {
            return NextResponse.json({ error: "Ürün ID eşleşmedi." }, { status: 400 });
        }

        await connectToDB();
        const user = await User.findOne({ email: data.attributes.user_email });

        if (!user) {
            return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
        }

        // 📅 Tarihleri parse et
        const attr = data.attributes;

        const startDate = tryParseDate(attr.created_at);
        const renewDate = tryParseDate(attr.renews_at);
        const endDate = tryParseDate(attr.ends_at);
        const trialEnd = tryParseDate(attr.trial_ends_at);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            console.error("❌ Geçersiz tarih formatı:", data.attributes.created_at, data.attributes.renews_at);
            return NextResponse.json({ error: "Geçersiz tarih verisi" }, { status: 400 });
        }

        // ✅ Güncelle
        user.subscription = {
            status: "active",
            plan: planInfo.plan,
            billingCycle: planInfo.billing,
            subscriptionStart: startDate,
            subscriptionEnd: endDate || renewDate,
            subscriptionId: data.id,
            customerId: data.attributes.customer_id,
            trialStart: user.subscription?.trialStart ?? null,
            trialEnd: trialEnd ?? user.subscription?.trialEnd ?? null,
        };

        await user.save();

        return NextResponse.json({ message: "Abonelik başarıyla güncellendi" }, { status: 200 });
    } catch (error) {
        console.error("Webhook hatası:", error);
        return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
    }
}