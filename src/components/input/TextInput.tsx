"use client";

import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  isSending: boolean;
  onSend: () => Promise<void>;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
};

export default function TextInput({isSending, onSend, input, setInput}: Props) {
//   const [conversationId, setConversationId] = useState<string | null>(null);
  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if(!isSending) {
        onSend();
      }
    }
  }

  return (
    <Card className="w-full h-20 p-0 bg-[#2c2c2c] text-neutral-100 shadow-[7px_7px_0px_#c1ff72] border-0 outline-0 ring-0 rounded-3xl flex justify-center dark:bg-[#111111] dark:text-white dark:shadow-[7px_7px_0px_#d272ff]">
      <Textarea
        placeholder="Type a message..."
        className="w-full !border-none !focus:border-transparent !focus:outline-none !focus:ring-0 !ring-0 resize-none overflow-y-auto max-h-20 !placeholder-neutral-400 wrap-anywhere pl-4 pr-4 dark:bg-transparent bg-transparent"
        onChange={handleChange}
        value={input}
        onKeyDown={handleKeyDown}
      />
    </Card>
  );
}
