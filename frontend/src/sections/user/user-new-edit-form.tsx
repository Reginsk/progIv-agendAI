'use client';

import * as Yup from 'yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// types
import { IUserItem } from 'src/types/user';
// api
import { createUser, updateUser } from 'src/api/user';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFSelect,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

type Props = {
  currentUser?: IUserItem;
};

export default function UserNewEditForm({ currentUser }: Props) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    role: Yup.string().required('Role is required'),
    password: currentUser ? Yup.string() : Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      role: currentUser?.role || 'user',
      password: '',
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentUser) {
        // Update user - only send changed fields
        const updateData: Partial<IUserItem> = {};
        if (data.name !== currentUser.name) updateData.name = data.name;
        if (data.email !== currentUser.email) updateData.email = data.email;
        if (data.role !== currentUser.role) updateData.role = data.role;
        if (data.password) updateData.password = data.password;

        await updateUser(currentUser.id, updateData);
        enqueueSnackbar('User updated successfully!');
      } else {
        // Create new user
        await createUser({
          name: data.name,
          email: data.email,
          role: data.role,
          password: data.password,
        } as any);
        enqueueSnackbar('User created successfully!');
      }

      reset();
      router.push(paths.dashboard.user.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(typeof error === 'string' ? error : 'Something went wrong!', {
        variant: 'error',
      });
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <CardHeader
              title={currentUser ? 'Edit User' : 'New User'}
              sx={{ p: 0, mb: 3 }}
            />

            <Stack spacing={3}>
              <RHFTextField name="name" label="Full Name" />

              <RHFTextField name="email" label="Email Address" />

              <RHFSelect name="role" label="Role">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </RHFSelect>

              <RHFTextField
                name="password"
                label={currentUser ? 'New Password (leave empty to keep current)' : 'Password'}
                type="password"
              />
            </Stack>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
                size="large"
              >
                {currentUser ? 'Save Changes' : 'Create User'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
