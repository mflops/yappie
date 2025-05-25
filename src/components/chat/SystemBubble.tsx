import { Card } from "@/components/ui/card";
import { Inter } from "next/font/google";
import WordFadeIn from "./WordFadeIn";

type Props = React.PropsWithChildren<{
  useWordFadeIn?: boolean;
  content?: string;
}>;

const inter = Inter({style: "normal", subsets:["latin"]})

export default function SystemBubble({ children, useWordFadeIn = false, content }: Props) {
    return (
        <div className="flex w-full justify-start">
          <Card className={`max-w-[100%] sm:max-w-[75%] p-4 bg-[#b388ff] border-0 outline-0 ring-0 shadow-[7px_7px_0px_#fff085] text-neutral-950 ${inter.className} text-shadow-[0.4px_0.4px_0.01px_#000000] break-words dark:bg-[#323232] dark:text-white dark:shadow-[7px_7px_0px_#f4e990]`}>
            <div className="whitespace-pre-wrap break-words">
              {useWordFadeIn && content ? (
                <WordFadeIn text={content} isActive={useWordFadeIn} speed={40} />
              ) : (
                children
              )}
            </div>
          </Card>
        </div>
    );
}