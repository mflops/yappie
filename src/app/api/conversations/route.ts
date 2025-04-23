import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({error: "Unauthorised"}, {status: 401});
    }

    const { content } = await req.json();
    
    if (!content || content.trim() === "") {
        return NextResponse.json({error: "Empty message"}, {status: 400});
    }

    const email = session.user?.email;

    if (!email) {
        return NextResponse.json({error: "Unauthorised"}, {status: 401});
    }

    const user = await prisma.user.findUnique({
        where: {email}
    });

    if (!user) {
        return NextResponse.json({error: "User not found"}, {status: 404});
    }

    const conversation = prisma.conversation.create({
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
    })

    return NextResponse.json({id: (await conversation).id});
}