"use client";

import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

type Props = {
    isSending: boolean;
    setIsSending: React.Dispatch<React.SetStateAction<boolean>>;
    onSend: () => Promise<void>;
  };

export default function SendButton({onSend, isSending, setIsSending}: Props) {
    async function handleClick() {
        if(isSending) return;
        setIsSending(true);
        try {
            await onSend();
        } catch(err) {
            console.error("Send failed: ", err);
        } finally {
            setIsSending(false);
        }
    }
    return (
        <Button size='icon' className="h-20 w-20 flex items-center justify-center rounded-3xl bg-[#ff2975] shadow-[7px_7px_0px_#000000] outline-0 border-0 ring-0 !hover:outline-0 !hover:border-0 !hover:ring-0 dark:bg-[#323232] dark:text-white dark:shadow-[7px_7px_0px_#ff5ba0] dark:hover:bg-[#252525] dark:hover:shadow-[7px_7px_0px_#f4287e] cursor-pointer" onClick={handleClick}>
            <Send className="!h-8 !w-8 drop-shadow-[1px_1px_0.5px_#000000]"/>
        </Button>
    );
}