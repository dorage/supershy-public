import {
  CreateInfiniteQueryOptions,
  CreateQueryOptions,
  SolidQueryKey,
  createInfiniteQuery,
  createQuery,
} from '@tanstack/solid-query';

export const createQueryKit = <
  TArgs,
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends SolidQueryKey = SolidQueryKey
>(
  queryKey: (args: TArgs) => readonly unknown[],
  queryFn: (args: TArgs) => Promise<TQueryFnData> | TQueryFnData,
  options?: Omit<
    CreateQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'queryKey' | 'queryFn' | 'initialData'
  > & { initialData?: () => undefined }
) => {
  return {
    query: (args: TArgs) =>
      createQuery((() => queryKey(args)) as any, () => queryFn(args), options),
    queryKey,
    queryFn,
  };
};

export const createInfiniteQueryKit = <
  TArgs extends { pageParams?: { lastId?: string; pageSize?: number } },
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends SolidQueryKey = SolidQueryKey
>(
  queryKey: (args: TArgs) => readonly unknown[],
  queryFn: (args: TArgs) => Promise<TQueryFnData> | TQueryFnData,
  options?: Omit<
    CreateInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>,
    'queryKey' | 'queryFn'
  >
) => {
  return {
    query: (args: TArgs) =>
      createInfiniteQuery((() => queryKey(args)) as any, () => queryFn(args), options),
    queryKey,
    queryFn,
  };
};
