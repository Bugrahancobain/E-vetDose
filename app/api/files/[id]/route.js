import { NextResponse } from "next/server";
import { GridFSBucket, ObjectId } from "mongodb";

export async function GET(_req, context) {
    const { params } = context;
    const { db } = await connectToDatabase();
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });

    try {
        const fileId = new ObjectId(params.id);
        const downloadStream = bucket.openDownloadStream(fileId);

        return new NextResponse(downloadStream, {
            headers: { "Content-Type": "image/jpeg" },
        });
    } catch (error) {
        console.error("❌ GridFS hata:", error);
        return NextResponse.json({ error: "Geçersiz dosya" }, { status: 500 });
    }
}