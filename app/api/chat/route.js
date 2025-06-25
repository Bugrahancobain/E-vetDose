import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { messages } = await req.json();

        const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

        if (!OPENAI_API_KEY) {
            console.error("❌ OPENAI_API_KEY bulunamadı.");
            return NextResponse.json({ error: "API anahtarı eksik" }, { status: 500 });
        }

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages,
                max_tokens: 1000,
            }),
        });

        const data = await response.json();

        if (!data.choices || !data.choices[0]) {
            console.error("❌ OpenAI response:", data);
            return NextResponse.json({ error: "OpenAI yanıt vermedi" }, { status: 500 });
        }

        return NextResponse.json({ response: data.choices[0].message.content });
    } catch (error) {
        console.error("🔥 Sunucu hatası:", error);
        return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
    }
}