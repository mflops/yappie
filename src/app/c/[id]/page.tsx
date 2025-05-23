import ClientChatPage from "./ClientChatPage";

type Props = {
  params: {
    id: string,
  },
};

export default async function Page({ params }: Props) {
  return <ClientChatPage id={params.id} />;
}