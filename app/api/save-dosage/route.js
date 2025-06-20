import connectToDB from '../../../mongodb';
import User from '../../../models/User';

export async function POST(req) {
    try {
        const body = await req.json();
        const {
            uid,
            medication,
            animal,
            organ,
            method,
            weight,
            dose,
            requiredCc,
            concentration,
            date
        } = body;

        if (!uid) {
            return new Response(JSON.stringify({ error: 'UID eksik' }), { status: 400 });
        }

        await connectToDB();

        const user = await User.findOne({ uid });

        if (!user) {
            return new Response(JSON.stringify({ error: 'Kullanıcı bulunamadı' }), { status: 404 });
        }

        const newDosage = {
            medication,
            animal,
            organ,
            method,
            weight,
            dose,
            requiredCc,
            concentration,
            date,
            createdAt: new Date()
        };

        // Push işlemi (maksimum 10 kayıt)
        user.dosages.unshift(newDosage); // sona değil başa ekle
        user.dosages = user.dosages.slice(0, 10); // sadece son 10 kayıt

        await user.save();

        return new Response(JSON.stringify({ message: 'Dozaj kullanıcıya eklendi' }), { status: 201 });

    } catch (err) {
        console.error("⛔️ Kayıt hatası:", err);
        return new Response(JSON.stringify({ error: 'Sunucu hatası' }), { status: 500 });
    }
}