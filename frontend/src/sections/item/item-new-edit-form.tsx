'use client';

import * as Yup from 'yup';
import { useMemo, useEffect } from 'react';
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
import { IItemItem } from 'src/types/item';
// api
import { createItem, updateItem } from 'src/api/item';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFTextField,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

type Props = {
  currentItem?: IItemItem;
};

export default function ItemNewEditForm({ currentItem }: Props) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewItemSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    category: Yup.string().required('Category is required'),
    total_quantity: Yup.number()
      .required('Total quantity is required')
      .min(0, 'Total quantity must be at least 0'),
    available_quantity: Yup.number()
      .required('Available quantity is required')
      .min(0, 'Available quantity must be at least 0')
      .test('available-lte-total', 'Available quantity cannot exceed total quantity', function (value) {
        const { total_quantity } = this.parent;
        return value <= total_quantity;
      }),
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
    if (currentItem) {
      reset(defaultValues);
    }
  }, [currentItem, reset, defaultValues]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentItem) {
        // Update item - only send changed fields
        const updateData: Partial<IItemItem> = {};
        if (data.name !== currentItem.name) updateData.name = data.name;
        if (data.description !== currentItem.description) updateData.description = data.description;
        if (data.category !== currentItem.category) updateData.category = data.category;
        if (data.total_quantity !== currentItem.total_quantity) updateData.total_quantity = data.total_quantity;
        if (data.available_quantity !== currentItem.available_quantity) updateData.available_quantity = data.available_quantity;

        await updateItem(currentItem.id, updateData);
        enqueueSnackbar('Item updated successfully!');
      } else {
        // Create new item
        await createItem({
          name: data.name,
          description: data.description,
          category: data.category,
          total_quantity: data.total_quantity,
          available_quantity: data.available_quantity,
        } as any);
        enqueueSnackbar('Item created successfully!');
      }

      reset();
      router.push(paths.dashboard.item.list);
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
              title={currentItem ? 'Edit Item' : 'New Item'}
              sx={{ p: 0, mb: 3 }}
            />

            <Stack spacing={3}>
              <RHFTextField name="name" label="Item Name" />

              <RHFTextField name="category" label="Category" />

              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
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
              </Box>

              <RHFTextField
                name="description"
                label="Description"
                multiline
                rows={4}
              />
            </Stack>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
                size="large"
              >
                {currentItem ? 'Save Changes' : 'Create Item'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
