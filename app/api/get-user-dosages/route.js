import connectToDB from '../../../mongodb';
import User from '../../../models/User';

export async function POST(req) {
    const { uid } = await req.json();

    await connectToDB();

    const user = await User.findOne({ uid });

    if (!user) {
        return new Response(JSON.stringify({ error: 'Kullanıcı bulunamadı' }), { status: 404 });
    }

    return new Response(JSON.stringify(user.dosages || []), { status: 200 });
}