type Props = React.PropsWithChildren<object>;

export default function MessageInput({children} : Props) {
    return (
        <div className="flex items-center w-full gap-2">
            {children}
        </div>
    );
}