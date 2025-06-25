import connectToDB from "../../../../mongodb";
import { GridFSBucket, ObjectId } from "mongodb";

export async function GET(req, { params }) {
    try {
        const id = params.id;

        const conn = await connectToDB();
        const bucket = new GridFSBucket(conn.db, { bucketName: "images" });

        const downloadStream = bucket.openDownloadStream(new ObjectId(id));

        return new Response(downloadStream, {
            headers: {
                "Content-Type": "image/png",
                "Cache-Control": "public, max-age=31536000",
            },
        });
    } catch (err) {
        console.error("Görsel getirme hatası:", err);
        return new Response("Görsel bulunamadı", { status: 404 });
    }
}