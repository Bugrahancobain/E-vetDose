// src/app/[locale]/blog/page.jsx veya page.tsx
import clientPromise from "../../utils/mongo";
import BlogClient from "./BlogClient";

async function fetchBlogsFromMongo() {
    try {
        const client = await clientPromise;
        const db = client.db("evetdose");
        const collection = db.collection("blogs");

        const blogs = await collection
            .find({})
            .sort({ dateAdded: -1 }) // Tarihe göre azalan sırala
            .toArray();

        // MongoDB ObjectId yerine string id ver
        return blogs.map((blog) => ({
            ...blog,
            id: blog._id.toString(),
        }));
    } catch (error) {
        console.error("MongoDB blog fetch error:", error);
        return [];
    }
}

export default async function BlogPage({ params }) {
    const locale = params?.locale || "en";
    const blogs = await fetchBlogsFromMongo();

    return <BlogClient blogs={blogs} locale={locale} />;
}