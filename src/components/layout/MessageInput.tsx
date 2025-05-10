import { ReactNode } from "react";

type Props = {children: ReactNode};

export default function MessageInput({children} : Props) {
    return (
        <div className="flex items-center w-full gap-2">
            {children}
        </div>
    );
}