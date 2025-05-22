'use client';

import {Sidebar, SidebarHeader, SidebarFooter, SidebarContent, SidebarGroup} from '@/components/ui/sidebar';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Inter } from 'next/font/google';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

type Conversation = {
    id: string,
    title: string,
}

const inter = Inter({style: "normal", subsets:["latin"]});

export default function AppSidebar() {

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const {data: session} = useSession()
    const user = session?.user

    useEffect(() => {
        async function fetchConvos() {
            const res = await fetch("/api/conversations");
            if (res.ok) {
                const data = await res.json();
                setConversations(data);
            }
        }

        fetchConvos();
    }, []);

    return (
        <Sidebar variant='floating' className={`m-0 outline-0 border-0 ring-0 ${inter.className}`}>
            <SidebarHeader className='pt-6'>
                <h1 className='text-white text-center text-2xl font-bold'>Chats</h1>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup title='Chats'>
                    {conversations.length === 0 ? (
                        <div className='text-sm text-muted-foreground p-2'>No conversations yet.</div>
                    ): (
                        conversations.map((convo) => {
                            return (
                                <Link key={convo.id} href={`/c/${convo.id}`} className='block p-3 rounded-3xl text-center text-white'>
                                    {convo.title}
                                </Link>
                            )
                        })
                    )}
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <div className='flex p-2 bg-neutral-800 rounded-2xl gap-4'>
                    <Avatar>
                        <AvatarImage src={ user?.image ?? '' }/>
                        <AvatarFallback>{user?.name?.at(0) ?? '🧑'}</AvatarFallback>
                    </Avatar>
                    <Button onClick={() => signOut({redirect: true, callbackUrl: '/api/auth/signin'})} className='hover: cursor-pointer'>
                        <LogOut/>
                    </Button>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}