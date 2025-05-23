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
import { Skeleton } from '@/components/ui/skeleton';

type Conversation = {
    id: string,
    title: string,
}

const inter = Inter({style: "normal", subsets:["latin"]});

function ConversationSkeleton() {
    return (
        <div className="space-y-2 p-3 flex flex-col items-center">
            <Skeleton className="h-6 w-full rounded-3xl" />
            <Skeleton className="h-6 w-3/4 rounded-3xl" />
            <Skeleton className="h-6 w-6/7 rounded-3xl" />
        </div>
    );
}

export default function AppSidebar() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const {data: session} = useSession();
    const user = session?.user;

    useEffect(() => {
        async function fetchConvos() {
            try {
                setIsLoading(true);
                setError(null);
                const res = await fetch("/api/conversations");
                if (!res.ok) {
                    throw new Error('Failed to fetch conversations');
                }
                const data = await res.json();
                setConversations(data);
            } catch (err) {
                setError('Failed to load conversations');
                console.error('Error fetching conversations:', err);
            } finally {
                setIsLoading(false);
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
                <SidebarGroup>
                    {isLoading ? (
                        <ConversationSkeleton />
                    ) : error ? (
                        <div className='text-sm text-red-500 p-2'>{error}</div>
                    ) : conversations.length === 0 ? (
                        <div className='text-sm text-muted-foreground p-2'>Your inbox is emptier than my DMs.</div>
                    ) : (
                        conversations.map((convo) => (
                            <Link 
                                key={convo.id} 
                                href={`/c/${convo.id}`} 
                                className='block p-3 rounded-3xl text-center text-white hover:bg-neutral-800 transition-colors'
                            >
                                {convo.title}
                            </Link>
                        ))
                    )}
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <div className='flex p-2 bg-neutral-800 rounded-2xl gap-4 items-center w-full justify-center'>
                    <Avatar>
                        <AvatarImage src={user?.image ?? ''} />
                        <AvatarFallback>{user?.name?.at(0) ?? '🧑'}</AvatarFallback>
                    </Avatar>
                    <Button 
                        onClick={() => signOut({redirect: true, callbackUrl: '/api/auth/signin'})} 
                        className='hover:cursor-pointer'
                    >
                        <LogOut />
                    </Button>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}