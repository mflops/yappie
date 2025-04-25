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