import mongoose from 'mongoose';

let isConnected = false;

export const connectToDB = async () => {
    if (isConnected) return;

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'evetdose',
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        isConnected = true;
        console.log("✅ MongoDB bağlantısı başarılı");
    } catch (error) {
        console.error("❌ MongoDB bağlantı hatası:", error);
    }
};