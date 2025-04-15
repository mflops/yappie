import { Card } from "@/components/ui/card";

type Props = React.PropsWithChildren<object>;

export default function ChatLayout({children} : Props) {
    return (
        <Card className="h-full flex">
            {children}
        </Card>
    );
}