import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    try {
        const { messages } = req.body;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: messages.map(msg => ({ role: msg.role, content: msg.content })),
            max_tokens: 1000,
            temperature: 0.7,
        });

        const response = completion.choices[0]?.message?.content;
        return res.status(200).json({ response });
    } catch (err) {
        console.error("OpenAI Error:", err);
        return res.status(500).json({ error: "Mesaj gönderilemedi." });
    }
}