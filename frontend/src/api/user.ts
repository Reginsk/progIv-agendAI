import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';
// utils
import { fetcher, endpoints } from 'src/utils/axios';
import axiosInstance from 'src/utils/axios';
// types
import { IUserItem } from 'src/types/user';

// ----------------------------------------------------------------------

const URL = endpoints.user;

const options = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

export function useGetUsers() {
    const { data, isLoading, error, isValidating } = useSWR(URL.list, fetcher, options);

    const memoizedValue = useMemo(
        () => ({
            users: (data as IUserItem[]) || [],
            usersLoading: isLoading,
            usersError: error,
            usersValidating: isValidating,
            usersEmpty: !isLoading && !data?.length,
        }),
        [data?.users, error, isLoading, isValidating]
    );

    return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetUser(userId: string) {
    const { data, isLoading, error, isValidating } = useSWR(
        userId ? `${URL.details}/${userId}` : null,
        fetcher,
        options
    );

    const memoizedValue = useMemo(
        () => ({
            user: data as IUserItem,
            userLoading: isLoading,
            userError: error,
            userValidating: isValidating,
        }),
        [data?.user, error, isLoading, isValidating]
    );

    return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createUser(userData: Omit<IUserItem, 'id'>) {
    const res = await axiosInstance.post(URL.create, userData);

    // Invalidate the users list cache
    mutate(URL.list);

    return res.data;
}// ----------------------------------------------------------------------

export async function updateUser(userId: string, userData: Partial<IUserItem>) {
    const res = await axiosInstance.put(URL.update(userId), userData);

    // Invalidate the users list cache and individual user cache
    mutate(URL.list);
    mutate(`${URL.details}/${userId}`);

    return res.data;
}// ----------------------------------------------------------------------

export async function deleteUser(userId: string) {
    const res = await axiosInstance.delete(URL.delete(userId));

    // Invalidate the users list cache
    mutate(URL.list);

    return res.data;
}