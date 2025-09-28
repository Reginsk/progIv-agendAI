import * as Yup from 'yup';
import { useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// types
import { IItemItem } from 'src/types/item';
// api
import { updateItem } from 'src/api/item';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  currentItem?: IItemItem;
};

export default function ItemQuickEditForm({ currentItem, open, onClose }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const NewItemSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    category: Yup.string().required('Category is required'),
    total_quantity: Yup.number().required('Total quantity is required').min(0),
    available_quantity: Yup.number().required('Available quantity is required').min(0),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentItem?.name || '',
      description: currentItem?.description || '',
      category: currentItem?.category || '',
      total_quantity: currentItem?.total_quantity || 0,
      available_quantity: currentItem?.available_quantity || 0,
    }),
    [currentItem]
  );

  const methods = useForm({
    resolver: yupResolver(NewItemSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentItem && open) {
      reset(defaultValues);
    }
  }, [currentItem, open, reset, defaultValues]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentItem) {
        await updateItem(currentItem.id, data);
        enqueueSnackbar('Item updated successfully!');
        reset();
        onClose();
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Something went wrong!', { variant: 'error' });
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
        <DialogTitle>Quick Update</DialogTitle>

        <DialogContent>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
            sx={{ pt: 1 }}
          >
            <RHFTextField name="name" label="Item Name" />
            <RHFTextField name="category" label="Category" />

            <RHFTextField
              name="total_quantity"
              label="Total Quantity"
              type="number"
              InputLabelProps={{ shrink: true }}
            />
            <RHFTextField
              name="available_quantity"
              label="Available Quantity"
              type="number"
              InputLabelProps={{ shrink: true }}
            />

            <Box gridColumn="span 2">
              <RHFTextField
                name="description"
                label="Description"
                multiline
                rows={3}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Update
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
