'use client';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';
// api
import { useGetUser } from 'src/api/user';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import UserNewEditForm from '../user-new-edit-form-simple';

// ----------------------------------------------------------------------

export default function UserCreateView() {
    const settings = useSettingsContext();

    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Create a new user"
                links={[
                    {
                        name: 'Dashboard',
                        href: paths.dashboard.root,
                    },
                    {
                        name: 'User',
                        href: paths.dashboard.user.list,
                    },
                    { name: 'New user' },
                ]}
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            />

            <UserNewEditForm />
        </Container>
    );
}