import { NextResponse } from "next/server";

export async function POST(req) {
    const { messages } = await req.json();

    if (!messages || messages.length === 0) {
        return NextResponse.json({ error: "Eksik veri" }, { status: 400 });
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4.1",
                messages,
                temperature: 0.7,
            }),
        });

        const data = await response.json();

        if (!data.choices || !data.choices[0]) {
            return NextResponse.json({ error: "OpenAI yanıt vermedi" }, { status: 500 });
        }

        return NextResponse.json({ response: data.choices[0].message.content });
    } catch (err) {
        console.error("OpenAI hatası:", err);
        return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
    }
}