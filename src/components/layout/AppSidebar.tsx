'use client';

import {Sidebar, SidebarHeader, SidebarFooter, SidebarContent, SidebarGroup} from '@/components/ui/sidebar';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Inter } from 'next/font/google';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter, usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

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
    const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
    const {data: session} = useSession();
    const user = session?.user;
    const router = useRouter();
    const pathname = usePathname();

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

    const handleDeleteConversation = async (conversationId: string, e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation when clicking delete button
        e.stopPropagation();

        if (deletingIds.has(conversationId)) return; // Already deleting

        try {
            setDeletingIds(prev => new Set(prev).add(conversationId));
            
            const res = await fetch(`/api/conversations/${conversationId}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                throw new Error('Failed to delete conversation');
            }

            // Remove from local state
            setConversations(prev => prev.filter(conv => conv.id !== conversationId));

            // If we're currently viewing this conversation, redirect to home
            if (pathname === `/c/${conversationId}`) {
                router.push('/');
            }
        } catch (error) {
            console.error('Error deleting conversation:', error);
            setError('Failed to delete conversation');
        } finally {
            setDeletingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(conversationId);
                return newSet;
            });
        }
    };

    return (
        <Sidebar variant='floating' className={`m-0 outline-0 border-0 ring-0 ${inter.className} dark:bg-[#202020]`}>
            <SidebarHeader className='pt-3 pb-3 md:pt-6 md:pb-3 md:pl-2 md:pr-2 bg-neutral-100 md:bg-transparent dark:bg-neutral-900 md:dark:bg-transparent rounded-tr-3xl'>
                <h1 className='md:text-white text-black dark:text-white text-center text-2xl font-bold'>Chats</h1>
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
                            <div 
                                key={convo.id}
                                className='relative'
                            >
                                <Link 
                                    href={`/c/${convo.id}`} 
                                    className='block p-3 pr-12 rounded-3xl text-center md:text-white hover:bg-neutral-800 transition-colors'
                                    title={convo.title}
                                >
                                    {convo.title}
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-400 hover:text-red-300 hover:bg-red-900/20 p-1 h-8 w-8"
                                    onClick={(e) => handleDeleteConversation(convo.id, e)}
                                    disabled={deletingIds.has(convo.id)}
                                    title='Delete Chat'
                                >
                                    {deletingIds.has(convo.id) ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400"></div>
                                    ) : (
                                        <Trash2 size={16} />
                                    )}
                                </Button>
                            </div>
                        ))
                    )}
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className='bg-neutral-100 dark:bg-neutral-900 md:bg-transparent md:dark:bg-transparent rounded-br-3xl'>
                <div className='flex p-2 bg-neutral-200 rounded-2xl gap-4 items-center w-full justify-center dark:bg-neutral-800 md:bg-neutral-800'>
                    <Avatar>
                        <AvatarImage src={user?.image ?? ''} />
                        <AvatarFallback>{user?.name?.at(0) ?? '🧑'}</AvatarFallback>
                    </Avatar>
                    <Button 
                        onClick={() => signOut({redirect: true, callbackUrl: '/api/auth/signin'})} 
                        className='hover:cursor-pointer bg-white hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 md:bg-neutral-700 md:hover:bg-neutral-600'
                        title='Logout'
                        size='icon'
                        variant='outline'
                    >
                        <LogOut className='stroke-black dark:stroke-white md:stroke-white'/>
                    </Button>
                    <ThemeToggle />
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}