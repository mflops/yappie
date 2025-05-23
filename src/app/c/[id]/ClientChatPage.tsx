"use client"

import Header from "@/components/layout/Header";
import ChatLayout from "@/components/layout/ChatLayout";
import Container from "@/components/layout/Container";
import MessageInput from "@/components/layout/MessageInput";
import TextInput from "@/components/input/TextInput";
import SendButton from "@/components/input/SendButton";
import UserBubble from "@/components/chat/UserBubble";
import SystemBubble from "@/components/chat/SystemBubble";
import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";

type Props = {
  id: string
};

export default function Page({ id }: Props ) {
  const [isSending, setIsSending] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    async function fetchMessages() {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://localhost:3000';
      const res = await fetch(`${baseUrl}/api/messages?conversationId=${id}`, {cache: 'no-store'});
      const data = await res.json();
      setMessages(data.messages);
    }

    fetchMessages();
  }, [id]);

  async function handleSend() {
    if (isSending || input.trim() === "") return;
    setIsSending(true);
    
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({content: input, conversationId: id}),
      });

      if (res.ok) {
        const data = await res.json();
        setInput("");
        // Add the new messages to the existing messages array
        setMessages(prevMessages => [...prevMessages, data.message, data.aiMessage]);
      } else {
        console.error("Error sending message");
      }
    } catch (err) {
      console.error("Error: ", err);
    } finally {
      setIsSending(false);
    }
  }

  console.log(input, setInput, handleSend, isSending, setIsSending)

  return (
    <>
      <Container>
        <Header>YAPPIE</Header>
        <ChatLayout>
          {messages.map((msg: any) => {
            return msg.messageType === "user" ? (
            <UserBubble key={msg.id}>{msg.content}</UserBubble>
            ) : (
              <SystemBubble key={msg.id}>
                <div className="prose break-words max-w-full whitespace-pre-wrap">
                  <ReactMarkdown>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </SystemBubble>
            )
          })}
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