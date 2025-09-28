import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';
// utils
import { fetcher, endpoints } from 'src/utils/axios';
import axiosInstance from 'src/utils/axios';
// types
import { IBorrowItem, IBorrowCreate, IBorrowUpdate } from 'src/types/borrow';

// ----------------------------------------------------------------------

const URL = endpoints.borrow;

const options = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

export function useGetBorrows() {
    const { data, isLoading, error, isValidating } = useSWR(URL.list, fetcher, options);

    const memoizedValue = useMemo(
        () => ({
            borrows: (data as IBorrowItem[]) || [],
            borrowsLoading: isLoading,
            borrowsError: error,
            borrowsValidating: isValidating,
            borrowsEmpty: !isLoading && !data?.length,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetBorrow(borrowId: string) {
    const { data, isLoading, error, isValidating } = useSWR(
        borrowId ? `${URL.details}/${borrowId}` : null,
        fetcher,
        options
    );

    const memoizedValue = useMemo(
        () => ({
            borrow: data as IBorrowItem,
            borrowLoading: isLoading,
            borrowError: error,
            borrowValidating: isValidating,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createBorrow(borrowData: IBorrowCreate) {
    const response = await axiosInstance.post(URL.create, borrowData);
    
    mutate(URL.list);
    
    return response.data;
}

// ----------------------------------------------------------------------

export async function updateBorrow(borrowId: string, borrowData: IBorrowUpdate) {
    const response = await axiosInstance.put(URL.update(borrowId), borrowData);
    
    mutate(URL.list);
    mutate(`${URL.details}/${borrowId}`);
    
    return response.data;
}

// ----------------------------------------------------------------------

export async function deleteBorrow(borrowId: string) {
    const response = await axiosInstance.delete(URL.delete(borrowId));
    
    mutate(URL.list);
    
    return response.data;
}