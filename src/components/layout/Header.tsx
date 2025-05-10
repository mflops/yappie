import {Card} from '@/components/ui/card';
import { Bangers } from 'next/font/google';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { SquarePen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import Link from 'next/link';

type Props = React.PropsWithChildren<object>;
const bangers = Bangers({weight: "400", style: "normal", subsets: ['latin']})

export default function Header({children} : Props) {
    return (
    <Card className='flex-row items-center justify-center bg-black shadow-[7px_7px_0px_#ffba00] p-4 outline-none border-none rounded-3xl'>
        <div className='flex-1 flex-row flex items-center justify-start gap-3'>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <SidebarTrigger className='text-white hover:bg-neutral-500 hover:!text-black'/>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Sidebar</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant='ghost' size='icon' className={`${cn("size-7")} hover:bg-neutral-500 group`}>
                            <Link href={'/'}>
                                <SquarePen className='!w-5 !h-5 stroke-white group-hover:stroke-black'/>
                            </Link>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>New Chat</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            
        </div>
        <div className='flex-1 text-center'>
          <h1 className={`${bangers.className} text-amber-400 text-5xl text-shadow-[1px_1px_0.2px_#ffffff]`}>{children}</h1>
        </div>
        <div className='flex-1'/> {/* empty div to balance */}
    </Card>
    )
}