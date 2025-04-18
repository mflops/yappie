import { Card } from "@/components/ui/card";
import { Inter } from "next/font/google";

type Props = React.PropsWithChildren<object>;
const inter = Inter({style: "normal", subsets:["latin"]})

export default function SystemBubble({children} : Props) {
    return (
        <div className="flex w-full justify-start">
          <Card className={`flex items-center justify-center p-4 max-w-180 wrap-anywhere bg-[#b388ff] shadow-[7px_7px_0px_#fff085] border-0 outline-0 ring-0 text-neutral-950 ${inter.className} text-shadow-[0.4px_0.4px_0.01px_#000000]`}>
            {children}
          </Card>
        </div>
    );
}