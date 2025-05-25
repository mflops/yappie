"use client";

import Header from "@/components/layout/Header";
import ChatLayout from "@/components/layout/ChatLayout";
import Container from "@/components/layout/Container";
import MessageInput from "@/components/layout/MessageInput";
import TextInput from "@/components/input/TextInput";
import SendButton from "@/components/input/SendButton";
import UserBubble from "@/components/chat/UserBubble";
import SystemBubble from "@/components/chat/SystemBubble";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type Message = {
  id: string;
  content: string;
  messageType: "user" | "assistant";
  createdAt: string;
};

export default function Home() {
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
        </div>
    );
  }

  if (!session) {
    return null;
  }

  async function handleSend() {
    if (isSending || input.trim() === "") return;
    
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      content: input,
      messageType: "user",
      createdAt: new Date().toISOString(),
    };

    const aiMessage: Message = {
      id: `temp-ai-${Date.now()}`,
      content: "",
      messageType: "assistant",
      createdAt: new Date().toISOString(),
    };

    // Optimistically add messages to show immediately
    setMessages([userMessage, aiMessage]);
    const currentInput = input;
    setInput("");
    setIsSending(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({content: currentInput}),
      });

      if (res.ok) {
        const data = await res.json();
        const convoId = data.conversationId;
        
        // Store optimistic messages in sessionStorage to avoid blank screen
        sessionStorage.setItem(`optimistic-${convoId}`, JSON.stringify([userMessage, aiMessage]));
        
        // Redirect to the conversation page where the real messages will be shown
        router.push(`/c/${convoId}`);
      } else {
        console.error("failed to send message");
        // Reset state on error
        setMessages([]);
        setInput(currentInput);
      }

    } catch(err) {
      console.error("Error: ", err);
      // Reset state on error
      setMessages([]);
      setInput(currentInput);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <>
      <Container>
        <Header>YAPPIE</Header>
        <ChatLayout>
          {messages.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-center text-xl text-neutral-500 select-none">
              No messages yet. Let&apos;s change that.
            </div>
          ) : (
            messages.map((msg) => (
              msg.messageType === "user" ? (
                <UserBubble key={msg.id}>{msg.content}</UserBubble>
              ) : (
                <SystemBubble key={msg.id}>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[300px]" />
                  </div>
                </SystemBubble>
              )
            ))
          )}
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
