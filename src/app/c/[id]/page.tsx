import ClientChatPage from "./ClientChatPage";

type Props = {
  params: Promise<{
    id: string;
  }>;
  // searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function Page({ params: paramsPromise }: Props) {
  const params = await paramsPromise;
  return <ClientChatPage id={params.id} />;
}