import React from "react";
import clientPromise from "../../../utils/mongo.ts";
import BlogDetailClient from "./BlogDetailClient";
import { ObjectId } from "mongodb";

export async function fetchBlogsAndCurrent(id) {
    try {
        const client = await clientPromise;
        const db = client.db("evetdose");
        const blogsCollection = db.collection("blogs");

        // Belirli blogu al
        const currentBlog = await blogsCollection.findOne({
            _id: new ObjectId(id),
        });

        // Tüm blogları al
        const blogs = await blogsCollection
            .find({})
            .sort({ dateAdded: -1 })
            .toArray();

        return {
            blogs: blogs.map((b) => ({
                ...b,
                id: b._id.toString(),
            })),
            currentBlog: currentBlog
                ? { ...currentBlog, id: currentBlog._id.toString() }
                : null,
        };
    } catch (error) {
        console.error("MongoDB fetch error:", error);
        return { blogs: [], currentBlog: null };
    }
}

export default async function BlogDetailPage({ params }) {
    const { id, locale } = params;
    const { blogs, currentBlog } = await fetchBlogsAndCurrent(id);

    if (!currentBlog) {
        return <p>Blog not found.</p>;
    }

    return (
        <BlogDetailClient
            blog={currentBlog}
            blogs={blogs}
            locale={locale}
        />
    );
}