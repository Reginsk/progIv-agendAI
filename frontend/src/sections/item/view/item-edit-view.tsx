'use client';

import { useParams } from 'next/navigation';
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// api
import { useGetItem } from 'src/api/item';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import ItemNewEditForm from '../item-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
    id: string;
};

export default function ItemEditView({ id }: Props) {
    const settings = useSettingsContext();

    const { item: currentItem } = useGetItem(id);

    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Edit"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Items', href: paths.dashboard.item.list },
                    { name: currentItem?.name },
                ]}
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            />

            <ItemNewEditForm currentItem={currentItem} />
        </Container>
    );
}