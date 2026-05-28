import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAddress,
  CreateAddressInput,
  deleteAddress,
  fetchAddresses,
  setDefaultAddress,
  updateAddress,
  UpdateAddressInput,
} from '@/shared/api/addresses';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';

export interface UseAddressesResult {
  addresses: import('@/types/models').UserAddress[];
  isLoading: boolean;
  isError: boolean;
  handleCreate: (input: CreateAddressInput, callbacks?: { onSuccess?: () => void; onError?: () => void }) => void;
  handleUpdate: (id: number, input: UpdateAddressInput, callbacks?: { onSuccess?: () => void; onError?: (err: unknown) => void }) => void;
  handleDelete: (id: number, callbacks?: { onSuccess?: () => void }) => void;
  handleSetDefault: (id: number) => void;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function useAddresses(): UseAddressesResult {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.ADDRESSES.LIST,
    queryFn:  fetchAddresses,
  });

  const invalidate = (): void => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADDRESSES.LIST });
  };

  const createMutation = useMutation({
    mutationFn: createAddress,
    onSuccess:  invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateAddressInput }) =>
      updateAddress(id, input),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess:  invalidate,
  });

  const setDefaultMutation = useMutation({
    mutationFn: setDefaultAddress,
    onSuccess:  invalidate,
  });

  return {
    addresses: data ?? [],
    isLoading,
    isError,
    handleCreate: (input, callbacks) =>
      createMutation.mutate(input, {
        ...(callbacks?.onSuccess ? { onSuccess: callbacks.onSuccess } : {}),
        ...(callbacks?.onError   ? { onError:   callbacks.onError   } : {}),
      }),
    handleUpdate: (id, input, callbacks) =>
      updateMutation.mutate({ id, input }, {
        ...(callbacks?.onSuccess ? { onSuccess: callbacks.onSuccess } : {}),
        ...(callbacks?.onError   ? { onError:   callbacks.onError   } : {}),
      }),
    handleDelete: (id, callbacks) =>
      deleteMutation.mutate(id, {
        ...(callbacks?.onSuccess ? { onSuccess: callbacks.onSuccess } : {}),
      }),
    handleSetDefault: (id) => setDefaultMutation.mutate(id),
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
