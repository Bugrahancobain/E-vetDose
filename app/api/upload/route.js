import { NextResponse } from "next/server";
import { connectToDatabase } from '../../../mongodb';
import { GridFSBucket } from "mongodb";
import { Readable } from "stream";

// FormData desteği için
export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req) {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
        return NextResponse.json({ error: "Geçersiz içerik türü" }, { status: 400 });
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const userId = formData.get("userId");

    if (!file || !userId) {
        return NextResponse.json({ error: "Eksik veri" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const stream = Readable.from(buffer);

    const { db } = await connectToDatabase();
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });

    const uploadStream = bucket.openUploadStream(file.name, {
        metadata: {
            userId,
            uploadedAt: new Date(),
        },
    });

    await new Promise((resolve, reject) => {
        stream.pipe(uploadStream)
            .on("finish", resolve)
            .on("error", reject);
    });

    const fileUrl = `/api/files/${uploadStream.id}`; // Geri döneceğimiz erişim adresi

    return NextResponse.json({ url: fileUrl });
}