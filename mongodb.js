import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env") });

import mongoose from "mongoose";

let isConnected = false;

export const connectToDatabase = async () => {
    if (!isConnected) {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "evetdose",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        isConnected = true;
        console.log("✅ MongoDB bağlantısı (GridFS için) başarılı");
    }

    const db = mongoose.connection.db;

    if (!db) {
        throw new Error("❌ db bağlantısı hazır değil. Lütfen tekrar deneyin.");
    }

    return { db };
};

const connectToDB = async () => {
    if (isConnected) return;

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "evetdose",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        isConnected = true;
        console.log("✅ MongoDB bağlantısı başarılı");
    } catch (error) {
        console.error("❌ MongoDB bağlantı hatası:", error);
    }
};

export default connectToDB;