"use client";

import Header from "@/components/layout/Header";
import ChatLayout from "@/components/layout/ChatLayout";
import Container from "@/components/layout/Container";
import MessageInput from "@/components/layout/MessageInput";
import TextInput from "@/components/input/TextInput";
import SendButton from "@/components/input/SendButton";
import UserBubble from "@/components/chat/UserBubble";
import SystemBubble from "@/components/chat/SystemBubble";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();

  async function handleSend() {
    if (isSending || input.trim() === "") return;
    setIsSending(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({content: input}),
      });

      if (res.ok) {
        const data = await res.json();
        const convoId = data.conversationId;
        router.push(`/c/${convoId}`);
      } else {
        console.error("failed to send message");
      }

    } catch(err) {
      console.error("Error: ", err);
    } finally {
      setIsSending(false);
    }
  }
  return (
    <>
      <Container>
        <Header>YAPPIE</Header>
        <ChatLayout>
          <UserBubble>
            Hello.
          </UserBubble>
          <SystemBubble>
            Hi.
          </SystemBubble>
        </ChatLayout>
        <MessageInput>
          <TextInput 
          isSending={isSending}
          onSend={handleSend}
          input={input}
          setInput={setInput}
          />
          <SendButton 
          isSending={isSending}
          setIsSending={setIsSending}
          onSend={handleSend}
          />
        </MessageInput>
      </Container>
    </>
  );
}
