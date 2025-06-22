import { NextResponse } from "next/server";
import connectToDB from "../../../../mongodb";
import User from "../../../../models/User";

export async function POST(req) {
    try {
        const payload = await req.json();
        const event = payload.meta.event_name;
        const data = payload.data;

        const productId = data.attributes.product_id;

        const mapping = {
            "556653": { plan: "basic", billing: "monthly" },
            "556667": { plan: "basic", billing: "yearly" },
            "556665": { plan: "enterprise", billing: "monthly" },
            "556669": { plan: "enterprise", billing: "yearly" },
            "556664": { plan: "pro", billing: "monthly" },
            "556668": { plan: "pro", billing: "yearly" }
        };

        const match = mapping[productId];

        if (!match) {
            return NextResponse.json({ error: "Ürün ID eşleşmedi." }, { status: 400 });
        }

        await connectToDB();

        const user = await User.findOne({ email: data.attributes.user_email || data.attributes.customer_email });

        if (!user) {
            return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
        }

        user.subscription = {
            status: "active",
            plan: match.plan,
            billingCycle: match.billing,
            subscriptionStart: new Date(data.attributes.starts_at),
            subscriptionEnd: new Date(data.attributes.renews_at),
            subscriptionId: data.id,
            customerId: data.attributes.customer_id,
            trialStart: user.subscription.trialStart,
            trialEnd: user.subscription.trialEnd
        };

        await user.save();

        return NextResponse.json({ message: "Abonelik bilgileri güncellendi." }, { status: 200 });
    } catch (error) {
        console.error("Webhook hatası:", error);
        return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
    }
}