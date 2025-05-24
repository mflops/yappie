import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAIResponse, getChatTitle, generateContext } from "@/lib/openai";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { content, conversationId } = body;

        if (!content || typeof content !== "string") {
            return NextResponse.json({ error: "Invalid content" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        let convoId = conversationId;

        if (!conversationId) {
            const title = await getChatTitle(content);
            const newConvo = await prisma.conversation.create({
                data: {
                    userId: user.id,
                    title: title ?? "New Chat",
                },
            });
            convoId = newConvo.id;
        }

        const message = await prisma.message.create({
            data: {
                conversationId: convoId,
                userId: user.id,
                content,
                messageType: "user",
            },
        });

        const previousMessages = await prisma.message.findMany({
            where: { conversationId: convoId },
            orderBy: { createdAt: "asc" },
        });

        const formattedMessages: ChatCompletionMessageParam[] = previousMessages.map(
            (msg: { messageType: string; content: string }) => ({
                role: msg.messageType === "user" ? "user" : "assistant",
                content: msg.content,
            })
        );

        // Generate context from previous messages
        const context = await generateContext(formattedMessages);

        // Add system message with personality and context
        formattedMessages.unshift({
            role: "system",
            content: `You are YAPPIE, a brainrot bot who is kinda nonchalant and is based on memes and internet terms.
            You talk like someone who is chronically online. Do not use unnecessary emojis. Do not be boring. Light swearing is okay, you can creatively censor it, do not be excessive with it. Use abberivations like "fr, ong, ig, idk, idc" etc.. You can be a little mean. But also be helpful. Do not overdo it.

            Here's the context of our conversation so far:
            ${context}`,
        });

        const aiResponse = await getAIResponse(formattedMessages);

        const aiMessage = await prisma.message.create({
            data: {
                conversationId: convoId,
                content: aiResponse ?? "",
                messageType: "assistant",
            },
        });

        return NextResponse.json(
            { message, aiMessage, conversationId: convoId },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error in message handling:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const conversationId = searchParams.get("conversationId");

        if (!conversationId) {
            return NextResponse.json(
                { error: "Missing conversationId" },
                { status: 400 }
            );
        }

        // Get user to verify ownership
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Verify the conversation belongs to the user
        const conversation = await prisma.conversation.findFirst({
            where: { 
                id: conversationId,
                userId: user.id 
            },
        });

        if (!conversation) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
        }

        const messages = await prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: "asc" },
        });

        return NextResponse.json({ messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
