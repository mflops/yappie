import Header from "@/components/layout/Header";
import ChatLayout from "@/components/layout/ChatLayout";
import Container from "@/components/layout/Container";
import MessageInput from "@/components/layout/MessageInput";
import TextInput from "@/components/input/TextInput";
import SendButton from "@/components/input/SendButton";
import UserBubble from "@/components/chat/UserBubble";
import SystemBubble from "@/components/chat/SystemBubble";

export default function Home() {
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
          <TextInput />
          <SendButton />
        </MessageInput>
      </Container>
    </>
  );
}
