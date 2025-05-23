"use client"

import Header from "@/components/layout/Header";
import ChatLayout from "@/components/layout/ChatLayout";
import Container from "@/components/layout/Container";
import MessageInput from "@/components/layout/MessageInput";
import TextInput from "@/components/input/TextInput";
import SendButton from "@/components/input/SendButton";
import UserBubble from "@/components/chat/UserBubble";
import SystemBubble from "@/components/chat/SystemBubble";
import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";

type Message = {
  id: string;
  content: string;
  messageType: "user" | "assistant";
  createdAt: string;
};

type Props = {
  id: string
};

export default function Page({ id }: Props ) {
  const [isSending, setIsSending] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [latestAssistantMessageId, setLatestAssistantMessageId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/messages?conversationId=${id}`, {cache: 'no-store'});
        if (!res.ok) throw new Error('Failed to fetch messages');
        const data = await res.json();
        setMessages(data.messages);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages");
      }
    }

    fetchMessages();
  }, [id]);

  // Track the latest assistant message for word fade-in effect
  useEffect(() => {
    const assistantMessages = messages.filter(msg => msg.messageType === "assistant" && msg.content !== "");
    if (assistantMessages.length > 0) {
      const latest = assistantMessages[assistantMessages.length - 1];
      setLatestAssistantMessageId(latest.id);
    }
  }, [messages]);

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

    // Optimistically add messages
    setMessages(prev => [...prev, userMessage, aiMessage]);
    setInput("");
    setIsSending(true);
    setError(null);
    
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({content: input, conversationId: id}),
      });

      if (!res.ok) throw new Error('Failed to send message');
      
      const data = await res.json();
      
      // Replace temporary messages with real ones
      setMessages(prev => 
        prev.map(msg => {
          if (msg.id === userMessage.id) return data.message;
          if (msg.id === aiMessage.id) return data.aiMessage;
          return msg;
        })
      );
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message");
      
      // Remove temporary messages on error
      setMessages(prev => 
        prev.filter(msg => msg.id !== userMessage.id && msg.id !== aiMessage.id)
      );
      
      // Restore input
      setInput(userMessage.content);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <>
      <Container>
        <Header>YAPPIE</Header>
        <ChatLayout>
          {error && (
            <div className="text-red-500 text-center p-2 bg-red-100 rounded">
              {error}
            </div>
          )}
          {messages.map((msg) => (
            msg.messageType === "user" ? (
              <UserBubble key={msg.id}>{msg.content}</UserBubble>
            ) : (
              <SystemBubble 
                key={msg.id}
                useWordFadeIn={msg.id === latestAssistantMessageId && msg.content !== ""}
                content={msg.content}
              >
                {msg.content === "" ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[300px]" />
                  </div>
                ) : (
                  <div className="prose break-words max-w-full whitespace-pre-wrap">
                    <ReactMarkdown>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                )}
              </SystemBubble>
            )
          ))}
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