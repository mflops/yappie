import {Card} from '@/components/ui/card';
import { Bangers } from 'next/font/google';

type Props = React.PropsWithChildren<object>;
const bangers = Bangers({weight: "400", style: "normal", subsets: ['latin']})

export default function Header({children} : Props) {
    return (
    <Card className='flex items-center justify-center bg-black shadow-[7px_7px_0px_#ffba00] p-4 outline-none border-none rounded-3xl'>
        <h1 className={`${bangers.className} text-amber-400 text-5xl`}>{children}</h1>
    </Card>
    )
}