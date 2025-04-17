import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
export default function TextInput() {
    return (
        <Card className="w-full h-20 p-0 bg-[#2c2c2c] text-neutral-100 shadow-[7px_7px_0px_#c1ff72] border-0 outline-0 ring-0 rounded-3xl flex justify-center">
            <Textarea placeholder="Type a message..." className="w-full !border-none !focus:border-transparent !focus:outline-none !focus:ring-0 !ring-0 resize-none overflow-y-auto max-h-20 !placeholder-neutral-400 wrap-anywhere pl-4 pr-4"/>
        </Card>
    );
}