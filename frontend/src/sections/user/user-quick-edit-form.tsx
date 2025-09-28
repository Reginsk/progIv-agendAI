'use client';

import * as Yup from 'yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// types
import { IUserItem } from 'src/types/user';
// api
import { updateUser } from 'src/api/user';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFSelect,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  currentUser?: IUserItem;
};

export default function UserQuickEditForm({ currentUser, open, onClose }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    role: Yup.string().required('Role is required'),
    password: Yup.string(),
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

        reset();
        onClose();
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(typeof error === 'string' ? error : 'Something went wrong!', {
        variant: 'error',
      });
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Quick Edit User</DialogTitle>

        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <RHFTextField name="name" label="Full Name" />

            <RHFTextField name="email" label="Email Address" />

            <RHFSelect name="role" label="Role">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </RHFSelect>

            <RHFTextField
              name="password"
              label="New Password (leave empty to keep current)"
              type="password"
            />

          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Save Changes
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
