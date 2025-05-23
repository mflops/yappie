"use client";

import Header from "@/components/layout/Header";
import ChatLayout from "@/components/layout/ChatLayout";
import Container from "@/components/layout/Container";
import MessageInput from "@/components/layout/MessageInput";
import TextInput from "@/components/input/TextInput";
import SendButton from "@/components/input/SendButton";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Home() {
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <Container>
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
      </Container>
    );
  }

  if (!session) {
    return null;
  }

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
          <div className="w-full h-full flex items-center justify-center text-center text-xl text-neutral-500">No messages yet. Let's change that.</div>
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
