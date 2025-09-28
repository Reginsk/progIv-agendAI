import { useCallback, useMemo, useEffect } from 'react';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DialogActions from '@mui/material/DialogActions';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
// api
import { createBorrow, updateBorrow, deleteBorrow, useGetBorrow } from 'src/api/borrow';
import { useGetUsers } from 'src/api/user';
import { useGetItems } from 'src/api/item';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
// types
import { IBorrowItem, IBorrowCreate, IBorrowUpdate, IBorrowStatus } from 'src/types/borrow';

// ----------------------------------------------------------------------

type Props = {
  onClose: VoidFunction;
  currentBorrowId?: string;
};

export default function CalendarBorrowForm({ currentBorrowId, onClose }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const shouldFetchBorrow = currentBorrowId && currentBorrowId.length > 0;
  const { borrow: currentBorrow, borrowLoading } = useGetBorrow(shouldFetchBorrow ? currentBorrowId : '');

  const { users, usersLoading } = useGetUsers();
  const { items, itemsLoading } = useGetItems();

  const BorrowSchema = Yup.object().shape({
    userId: Yup.string().required('User is required'),
    itemId: Yup.string().required('Item is required'),
    quantity: Yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
    borrow_date: Yup.date().required('Borrow date is required'),
    due_date: Yup.date().required('Due date is required'),
  });

  const defaultValues = useMemo(() => {
    if (currentBorrow) {

      return {
        userId: currentBorrow.userId,
        itemId: currentBorrow.itemId,
        quantity: currentBorrow.quantity,
        borrow_date: new Date(currentBorrow.borrow_date),
        due_date: new Date(currentBorrow.due_date),
        returned_date: currentBorrow.returned_date ? new Date(currentBorrow.returned_date) : null,
        status: currentBorrow.status,
      };
    }
    return {
      userId: '',
      itemId: '',
      quantity: 1,
      borrow_date: new Date(),
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      returned_date: null,
      status: 'active' as const,
    };
  }, [currentBorrow, users, items]);

  const methods = useForm({
    resolver: yupResolver(BorrowSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();
  const isEditing = Boolean(currentBorrowId && currentBorrow);
  const dateError = values.borrow_date && values.due_date ? values.borrow_date > values.due_date : false;

  useEffect(() => {
    if (currentBorrow && users.length > 0 && items.length > 0) {

      const userId = currentBorrow.user?.id || currentBorrow.userId;
      const itemId = currentBorrow.item?.id || currentBorrow.itemId;

      const formValues = {
        userId,
        itemId,
        quantity: currentBorrow.quantity,
        borrow_date: new Date(currentBorrow.borrow_date),
        due_date: new Date(currentBorrow.due_date),
        returned_date: currentBorrow.returned_date ? new Date(currentBorrow.returned_date) : null,
        status: currentBorrow.status,
      };

      reset(formValues);
    }
  }, [currentBorrow, users, items, reset]);

  const onSubmit = handleSubmit(async (data) => {

    try {
      if (!dateError) {
        if (isEditing) {
          const updateData: IBorrowUpdate = {
            quantity: data.quantity,
            due_date: new Date(data.due_date as Date).toISOString(),
            returned_date: data.returned_date ? new Date(data.returned_date as Date).toISOString() : undefined,
            status: data.status as IBorrowStatus,
          };
          await updateBorrow(currentBorrowId!, updateData);
          enqueueSnackbar('Borrow updated successfully!');
        } else {
          const createData: IBorrowCreate = {
            userId: data.userId,
            itemId: data.itemId,
            quantity: data.quantity,
            borrow_date: new Date(data.borrow_date as Date).toISOString(),
            due_date: new Date(data.due_date as Date).toISOString(),
          };
          await createBorrow(createData);
          enqueueSnackbar('Borrow created successfully!');
        }
        onClose();
        reset();
      } else {
        console.warn('Date error prevented submission');
      }
    } catch (error) {
      enqueueSnackbar('Something went wrong!', { variant: 'error' });
    }
  });

  const onDelete = useCallback(async () => {
    if (!currentBorrowId) return;

    try {
      await deleteBorrow(currentBorrowId);
      enqueueSnackbar('Borrow deleted successfully!');
      onClose();
    } catch (error) {
      enqueueSnackbar('Feature not implemented!', { variant: 'error' });
    }
  }, [currentBorrowId, enqueueSnackbar, onClose]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'primary';
      case 'returned':
        return 'success';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  if ((shouldFetchBorrow && borrowLoading) || usersLoading || itemsLoading) {
    return <Box sx={{ p: 3 }}>Loading...</Box>;
  }

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ px: 3 }}>
        <Controller
          name="userId"
          control={control}
          render={({ field, fieldState: { error } }) => {
            const selectedUser = users.find((user) => user.id === field.value);

            return (
              <Autocomplete
                options={users}
                getOptionLabel={(option) => option.name || ''}
                value={selectedUser || null}
                onChange={(_, value) => {
                  field.onChange(value?.id || '');
                }}
                disabled={isEditing} // Don't allow changing user when editing
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="User"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            );
          }}
        />

        <Controller
          name="itemId"
          control={control}
          render={({ field, fieldState: { error } }) => {
            const selectedItem = items.find((item) => item.id === field.value);

            return (
              <Autocomplete
                options={items}
                getOptionLabel={(option) => option.name || ''}
                value={selectedItem || null}
                onChange={(_, value) => {
                  field.onChange(value?.id || '');
                }}
                disabled={isEditing} // Don't allow changing item when editing
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Item"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            );
          }}
        />

        <RHFTextField
          name="quantity"
          label="Quantity"
          type="number"
          InputProps={{ inputProps: { min: 1 } }}
        />

        <Controller
          name="borrow_date"
          control={control}
          render={({ field }) => (
            <MobileDateTimePicker
              {...field}
              label="Borrow date"
              format="dd/MM/yyyy hh:mm a"
              disabled={isEditing} // Don't allow changing borrow date when editing
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />
          )}
        />

        <Controller
          name="due_date"
          control={control}
          render={({ field }) => (
            <MobileDateTimePicker
              {...field}
              label="Due date"
              format="dd/MM/yyyy hh:mm a"
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: dateError,
                  helperText: dateError && 'Due date must be later than borrow date',
                },
              }}
            />
          )}
        />

        {isEditing && (
          <>
            <Controller
              name="returned_date"
              control={control}
              render={({ field }) => (
                <MobileDateTimePicker
                  {...field}
                  label="Returned date"
                  format="dd/MM/yyyy hh:mm a"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              )}
            />

            <Box>
              <Chip
                label={(values.status || 'active').charAt(0).toUpperCase() + (values.status || 'active').slice(1)}
                color={getStatusColor(values.status || 'active') as any}
                size="small"
              />
            </Box>
          </>
        )}
      </Stack>

      <DialogActions>
        {isEditing && (
          <Tooltip title="Delete Borrow">
            <IconButton onClick={onDelete}>
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cancel
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
          disabled={dateError}
        >
          {isEditing ? 'Update' : 'Create'} Borrow
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
}