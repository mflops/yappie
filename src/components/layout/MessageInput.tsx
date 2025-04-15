type Props = React.PropsWithChildren<object>;

export default function MessageInput({children} : Props) {
    return (
        <div>
            {children}
        </div>
    );
}