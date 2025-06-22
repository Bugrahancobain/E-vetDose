import connectToDB from '../../../mongodb';
import User from '../../../models/User.js'; // Kullanıcı modeli

export async function POST(req) {
    try {
        const body = await req.json();
        const { uid, email, fullName, profileImage } = body; // 👈 profileImage eklendi

        await connectToDB();

        const existingUser = await User.findOne({ uid });
        if (existingUser) {
            return new Response(JSON.stringify({ message: 'Kullanıcı zaten kayıtlı.' }), { status: 400 });
        }

        const newUser = new User({
            uid,
            email,
            fullName,
            profileImage: profileImage || "", // 👈 base64 varsa kaydet
            createdAt: new Date(),
            subscription: {
                status: "trial",
                plan: null,
                billingCycle: null,
                trialStart: new Date(),
                trialEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 gün sonrası
                subscriptionStart: null,
                subscriptionEnd: null,
                subscriptionId: null,
                customerId: null
            }

        });

        await newUser.save();

        return new Response(JSON.stringify({ message: 'Kullanıcı başarıyla kaydedildi.' }), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Sunucu hatası' }), { status: 500 });
    }
}


export async function GET(req) {
    try {
        await connectToDB();
        const { searchParams } = new URL(req.url);
        const uid = searchParams.get('uid');

        if (!uid) {
            return new Response(JSON.stringify({ error: 'UID gerekli' }), { status: 400 });
        }

        const user = await User.findOne({ uid });

        if (!user) {
            return new Response(JSON.stringify({ error: 'Kullanıcı bulunamadı' }), { status: 404 });
        }

        // Tüm kullanıcı nesnesini döndürelim
        return new Response(JSON.stringify(user), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Sunucu hatası' }), { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const body = await req.json();
        const { uid, fullName, profileImage, subscription } = body;

        await connectToDB();

        const user = await User.findOne({ uid });
        if (!user) {
            return new Response(JSON.stringify({ error: "Kullanıcı bulunamadı" }), { status: 404 });
        }

        if (fullName) user.fullName = fullName;
        if (profileImage !== undefined) user.profileImage = profileImage;

        const result = await user.save();
        console.log("Kayıt sonucu:", result);

        return new Response(JSON.stringify({ message: "Profil güncellendi." }), { status: 200 });
    } catch (error) {
        console.error("PATCH HATASI:", error);
        return new Response(JSON.stringify({ error: "Sunucu hatası" }), { status: 500 });
    }
}