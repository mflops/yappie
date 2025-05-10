import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";

// const client = new OpenAI({apiKey: process.env.OPENAI_API_KEY})

const client = new OpenAI({
    baseURL: "https://router.huggingface.co/fireworks-ai/inference/v1",
    apiKey: process.env.HF_API_KEY,
});

export async function getAIResponse(messages: ChatCompletionMessageParam[]) {
    // const completion = await client.chat.completions.create({
    //     model: 'gpt-4o-mini',
    //     messages,
    // });

    const completion = await client.chat.completions.create({
        model: "accounts/fireworks/models/deepseek-v3-0324",
        messages,
    })

    return completion.choices[0].message.content;
}

export async function getChatTitle(firstMessage: string) {
    const completion = await client.chat.completions.create({
        model: "accounts/fireworks/models/deepseek-v3-0324",
        messages: [
            {
                role: "system",
                content: `You're a witty chat titler. Your job is to generate a short, punchy, creative title (max 6 words, no punctuation, no quotes) based ONLY on the user's first message. Make it a lil fun, a lil smart, but not cringe.`
            },
            {
                role: "user",
                content: firstMessage
            }
        ]
    })

    return completion.choices[0].message.content?.trim() || "Untitled";
}