import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({error: "Unauthorised"}, {status: 401});
    }

    const body = await req.json();
    const {content, conversationId} = body;

    if (!content || typeof content !== "string") {
        return NextResponse.json({error: "Invalid content"}, {status: 400});
    }

    const email = session.user.email;

    if (!email) {
        return NextResponse.json({error: "Unauthorised"}, {status: 401});
    }

    const user = await prisma.user.findUnique({
        where: {email}
    })

    if (!user) {
        return NextResponse.json({error: "User not found"}, {status: 404});
    }

    let convoId = conversationId;

    if (!conversationId) {
        const newConvo = await prisma.conversation.create({
            data: {
                userId: user.id,
            },
        });
        convoId = newConvo.id;
    }

    const message = await prisma.message.create({
        data: {
            conversationId: convoId,
            userId: user.id,
            content,
            messageType: 'user',
        },
    });

    return NextResponse.json({message, conversationId: convoId}, {status: 201});
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
        return NextResponse.json({error: "Missing conversationId"}, {status: 400});
    }

    const messages = await prisma.message.findMany({
        where: {conversationId},
        orderBy: {createdAt: 'asc'},
    })

    return NextResponse.json({ messages });
}