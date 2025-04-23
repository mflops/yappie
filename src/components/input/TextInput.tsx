"use client";

import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
    conversationId: string|null;
};

export default function TextInput({conversationId}: Props) {
//   const [conversationId, setConversationId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  async function handleSend() {
    if (input.trim() === "") return;

    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: input, conversationId }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log("Sent message: ", data);
        router.push(`/c/${data.conversationId}`);
    } else {
      console.error("Error sending message");
    }

    setInput("");
  }

  return (
    <Card className="w-full h-20 p-0 bg-[#2c2c2c] text-neutral-100 shadow-[7px_7px_0px_#c1ff72] border-0 outline-0 ring-0 rounded-3xl flex justify-center">
      <Textarea
        placeholder="Type a message..."
        className="w-full !border-none !focus:border-transparent !focus:outline-none !focus:ring-0 !ring-0 resize-none overflow-y-auto max-h-20 !placeholder-neutral-400 wrap-anywhere pl-4 pr-4"
        onChange={handleChange}
        value={input}
        onKeyDown={handleKeyDown}
      />
    </Card>
  );
}
