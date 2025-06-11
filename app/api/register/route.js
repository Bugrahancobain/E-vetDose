import { connectToDB } from '../../../mongodb';
import User from '../../../models/User.js'; // Kullanıcı modeli

export async function POST(req) {
    try {
        const body = await req.json();
        const { uid, email, fullName } = body;

        await connectToDB();

        // Kullanıcı daha önce eklenmiş mi kontrolü
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return new Response(JSON.stringify({ message: 'Kullanıcı zaten kayıtlı.' }), { status: 400 });
        }

        // Yeni kullanıcı oluştur
        const newUser = new User({
            uid,
            email,
            fullName,
            createdAt: new Date()
        });

        await newUser.save();

        return new Response(JSON.stringify({ message: 'Kullanıcı başarıyla kaydedildi.' }), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Sunucu hatası' }), { status: 500 });
    }
}