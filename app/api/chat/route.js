import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
    try {
        const body = await req.json(); // ✅ req.body yerine bu
        const { messages } = body;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: messages.map(msg => ({ role: msg.role, content: msg.content })),
            max_tokens: 1000,
            temperature: 0.7,
        });

        const response = completion.choices[0]?.message?.content;
        return NextResponse.json({ response }); // ✅ res.status yerine
    } catch (err) {
        console.error("OpenAI Error:", err);
        return NextResponse.json(
            { error: "Mesaj gönderilemedi." },
            { status: 500 }
        );
    }
}