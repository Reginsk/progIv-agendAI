import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';
// utils
import { fetcher, endpoints } from 'src/utils/axios';
import axiosInstance from 'src/utils/axios';
// types
import { IItemItem } from 'src/types/item';

// ----------------------------------------------------------------------

const URL = endpoints.item;

const options = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

export function useGetItems() {
    const { data, isLoading, error, isValidating } = useSWR(URL.list, fetcher, options);

    const memoizedValue = useMemo(
        () => ({
            items: (data as IItemItem[]) || [],
            itemsLoading: isLoading,
            itemsError: error,
            itemsValidating: isValidating,
            itemsEmpty: !isLoading && !data?.length,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetItem(itemId: string) {
    const { data, isLoading, error, isValidating } = useSWR(
        itemId ? `${URL.details}/${itemId}` : null,
        fetcher,
        options
    );

    const memoizedValue = useMemo(
        () => ({
            item: data as IItemItem,
            itemLoading: isLoading,
            itemError: error,
            itemValidating: isValidating,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createItem(itemData: Omit<IItemItem, 'id'>) {
    const res = await axiosInstance.post(URL.create, itemData);

    // Invalidate all items-related caches
    mutate((key) => typeof key === 'string' && key.includes('/items'));

    return res.data;
}

// ----------------------------------------------------------------------

export async function updateItem(itemId: string, itemData: Partial<IItemItem>) {
    const res = await axiosInstance.put(URL.update(itemId), itemData);

    // Invalidate all items-related caches
    mutate((key) => typeof key === 'string' && key.includes('/items'));

    return res.data;
}

// ----------------------------------------------------------------------

export async function deleteItem(itemId: string) {
    const res = await axiosInstance.delete(URL.delete(itemId));

    // Invalidate all items-related caches
    mutate((key) => typeof key === 'string' && key.includes('/items'));

    return res.data;
}