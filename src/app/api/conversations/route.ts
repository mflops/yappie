import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        const body = await req.json();
        const { content } = body;
        
        if (!content || typeof content !== "string" || content.trim() === "") {
            return NextResponse.json({error: "Invalid message content"}, {status: 400});
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({error: "User not found"}, {status: 404});
        }

        const conversation = await prisma.conversation.create({
            data: {
                userId: user.id,
                messages: {
                    create: {
                        content,
                        messageType: 'user',
                        userId: user.id,
                    },
                },
            },
            include: {
                messages: true,
            },
        });

        return NextResponse.json({id: conversation.id}, {status: 201});
    } catch (error) {
        console.error("Error creating conversation:", error);
        return NextResponse.json(
            {error: "Internal server error"}, 
            {status: 500}
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({error: "User not found"}, {status: 404});
        }

        const conversations = await prisma.conversation.findMany({
            where: {userId: user.id},
            orderBy: {createdAt: "desc"},
            select: {
                id: true,
                title: true,
                createdAt: true,
            }
        });

        return NextResponse.json(conversations);
    } catch (error) {
        console.error("Error fetching conversations:", error);
        return NextResponse.json(
            {error: "Internal server error"}, 
            {status: 500}
        );
    }
}