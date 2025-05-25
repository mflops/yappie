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
    // Check for optimistic messages in sessionStorage
    const optimisticKey = `optimistic-${id}`;
    const optimisticData = sessionStorage.getItem(optimisticKey);
    
    if (optimisticData) {
      try {
        const optimisticMessages = JSON.parse(optimisticData);
        setMessages(optimisticMessages);
        // Clean up the sessionStorage
        sessionStorage.removeItem(optimisticKey);
      } catch (err) {
        console.error("Error parsing optimistic messages:", err);
      }
    }

    async function fetchMessages() {
      try {
        console.log("Fetching messages for conversation:", id);
        const res = await fetch(`/api/messages?conversationId=${id}`, {
          cache: 'no-store',
          credentials: 'include'
        });
        
        console.log("Fetch response status:", res.status, res.statusText);
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
          console.error("API Error:", errorData);
          throw new Error(`Failed to fetch messages: ${errorData.error || res.statusText}`);
        }
        
        const data = await res.json();
        console.log("Fetched data:", data);
        
        if (!data.messages) {
          console.warn("No messages property in response:", data);
          // Only set empty if we don't have optimistic messages
          if (!optimisticData) {
            setMessages([]);
          }
          return;
        }
        
        if (!Array.isArray(data.messages)) {
          console.error("Messages is not an array:", data.messages);
          throw new Error("Invalid response format");
        }
        
        console.log("Setting messages:", data.messages);
        setMessages(data.messages);
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError(err instanceof Error ? err.message : "Failed to load messages");
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
        credentials: 'include'
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