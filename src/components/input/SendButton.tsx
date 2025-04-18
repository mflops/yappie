import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export default function SendButton() {
    return (
        <Button size='icon' className="h-20 w-20 flex items-center justify-center rounded-3xl bg-[#ff2975] shadow-[7px_7px_0px_#000000] outline-0 border-0 ring-0 !hover:outline-0 !hover:border-0 !hover:ring-0">
            <Send className="!h-8 !w-8 drop-shadow-[1px_1px_0.5px_#000000]"/>
        </Button>
    );
}