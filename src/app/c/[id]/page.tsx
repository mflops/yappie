import Header from "@/components/layout/Header";
import ChatLayout from "@/components/layout/ChatLayout";
import Container from "@/components/layout/Container";
import MessageInput from "@/components/layout/MessageInput";
import TextInput from "@/components/input/TextInput";
import SendButton from "@/components/input/SendButton";
import UserBubble from "@/components/chat/UserBubble";
import SystemBubble from "@/components/chat/SystemBubble";
import ReactMarkdown from "react-markdown";

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: Props ) {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://localhost:3000';
  const res = await fetch(`${baseUrl}/api/messages?conversationId=${id}`, {cache: 'no-store'});
  const data = await res.json();
  const messages = data.messages;
  // console.log(data.messages);
  // const messages = await prisma.message.findMany({
  //   where: { conversationId: id },
  //   orderBy: { createdAt: 'asc' },
  // })

  // console.log(messages);
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
          <TextInput conversationId={id}/>
          <SendButton />
        </MessageInput>
      </Container>
    </>
  );
}
