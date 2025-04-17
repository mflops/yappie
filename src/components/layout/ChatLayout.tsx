import { Card } from "@/components/ui/card";

type Props = React.PropsWithChildren<object>;

export default function ChatLayout({children} : Props) {
    return (
        <Card className="h-full flex p-4 gap-4 overflow-y-auto border-0 outline-0 ring-0 shadow-none">
            {children}
        </Card>
    );
}