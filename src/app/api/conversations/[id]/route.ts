import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Await params before using properties
        const { id: conversationId } = await params;

        // Check if the conversation exists and belongs to the user
        const conversation = await prisma.conversation.findFirst({
            where: {
                id: conversationId,
                userId: user.id,
            },
        });

        if (!conversation) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
        }

        // First delete all messages in the conversation
        await prisma.message.deleteMany({
            where: {
                conversationId: conversationId,
            },
        });

        // Then delete the conversation
        await prisma.conversation.delete({
            where: {
                id: conversationId,
            },
        });

        return NextResponse.json({ message: "Conversation deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting conversation:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 