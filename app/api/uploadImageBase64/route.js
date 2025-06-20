import { connectToDB } from "../../../mongodb";
import User from "../../../models/User";

export async function POST(req) {
    try {
        const { userId, fileName, base64Image } = await req.json();

        if (!userId || !base64Image) {
            return new Response(JSON.stringify({ error: "Eksik veri" }), { status: 400 });
        }

        await connectToDB();

        const user = await User.findOne({ uid: userId });

        if (!user) {
            return new Response(JSON.stringify({ error: "Kullanıcı bulunamadı" }), { status: 404 });
        }

        const imageEntry = {
            fileName,
            base64Image,
            uploadedAt: new Date()
        };

        user.images = user.images || [];
        user.images.unshift(imageEntry);
        user.images = user.images.slice(0, 10); // Son 10 görsel

        await user.save();

        return new Response(JSON.stringify({ message: "Görsel kaydedildi", url: base64Image }), { status: 201 });
    } catch (err) {
        console.error("⛔️ Görsel kayıt hatası:", err);
        return new Response(JSON.stringify({ error: "Sunucu hatası" }), { status: 500 });
    }
}