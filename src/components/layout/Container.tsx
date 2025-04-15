type Props = React.PropsWithChildren<object>;

export default function Container({children} : Props) {
    return (
        <div className="flex flex-col flex-1 h-full overflow-hidden p-2 gap-4">
            {children}
        </div>
    )
}