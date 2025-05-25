import { Card } from "@/components/ui/card";
import { useEffect, useRef } from "react";

type Props = {
    children: React.ReactNode;
};

export default function ChatLayout({children} : Props) {
    const chatRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [children]);

    return (
        <Card ref={chatRef} className="h-full flex flex-col p-4 gap-4 overflow-y-auto border-0 outline-0 ring-0 shadow-none dark:bg-[#202020]">
            {children}
        </Card>
    );
}