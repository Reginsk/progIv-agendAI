// sections
import { ItemEditView } from 'src/sections/item/view';

// ----------------------------------------------------------------------

export const metadata = {
    title: 'Dashboard: Item Edit',
};

type Props = {
    params: {
        id: string;
    };
};

export default function ItemEditPage({ params }: Props) {
    const { id } = params;

    return <ItemEditView id={id} />;
}