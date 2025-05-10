'use client';

import {Sidebar, SidebarHeader, SidebarFooter, SidebarContent, SidebarGroup} from '@/components/ui/sidebar';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Inter } from 'next/font/google';

type Conversation = {
    id: string,
    title: string,
}

const inter = Inter({style: "normal", subsets:["latin"]});

export default function AppSidebar() {

    const [conversations, setConversations] = useState<Conversation[]>([]);

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
            <SidebarFooter/>
        </Sidebar>
    )
}