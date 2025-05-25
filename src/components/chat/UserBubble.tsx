import { Card } from "@/components/ui/card";
import { Inter } from "next/font/google";

type Props = React.PropsWithChildren<object>;
const inter = Inter({style:"normal", subsets:["latin"]});

export default function UserBubble({children} : Props) {
    return (
        <div className="flex w-full justify-end">
          <Card className={`flex items-center justify-center p-4 max-w-180 wrap-anywhere bg-yellow-200 border-0 outline-0 ring-0 shadow-[7px_7px_0px_#b388ff] ${inter.className} text-shadow-[0.4px_0.4px_0.01px_#000000] dark:bg-[#333333] dark:shadow-[7px_7px_0px_#b7c2ff] dark:text-white`}>
            {children}
          </Card>
        </div>
    );
}