import {Card, CardContent} from '@/components/ui/card';

type Props = React.PropsWithChildren<object>;

export default function Header({children} : Props) {
    return (
    <Card>
        <h1>{children}</h1>
    </Card>
    )
}