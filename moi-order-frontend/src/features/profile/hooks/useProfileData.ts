import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchMe } from '@/shared/api/auth';
import { updateProfile, changePassword, deleteAccount, updateSimulatedDate } from '@/shared/api/profile';
import { CACHE_TTL } from '@/shared/constants/config';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { useAuthStore } from '@/shared/store/authStore';
import { User, ApiError } from '@/types/models';

export interface UseProfileDataResult {
  user: User | null;
  isLoading: boolean;
  isRefreshing: boolean;
  isError: boolean;
  refetch: () => void;
  updateMutation: ReturnType<typeof useMutation<User, ApiError, { name: string; email: string; phoneNumber: string | null; dateOfBirth: string | null }>>;
  changePasswordMutation: ReturnType<typeof useMutation<void, ApiError, { currentPassword: string; newPassword: string; confirmPassword: string }>>;
  deleteAccountMutation: ReturnType<typeof useMutation<void, ApiError, void>>;
  simulatedDateMutation: ReturnType<typeof useMutation<User, ApiError, { date: string | null }>>;
}

export function useProfileData(): UseProfileDataResult {
  const queryClient = useQueryClient();
  const updateUser  = useAuthStore((s) => s.updateUser);

  const query = useQuery({
    queryKey: QUERY_KEYS.PROFILE.ME,
    queryFn:  fetchMe,
    staleTime: CACHE_TTL.USER_DATA,
  });

  const updateMutation = useMutation<User, ApiError, { name: string; email: string; phoneNumber: string | null; dateOfBirth: string | null }>({
    mutationFn: ({ name, email, phoneNumber, dateOfBirth }) => updateProfile(name, email, phoneNumber, dateOfBirth),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(QUERY_KEYS.PROFILE.ME, updatedUser);
      updateUser(updatedUser);
    },
  });

  const changePasswordMutation = useMutation<void, ApiError, { currentPassword: string; newPassword: string; confirmPassword: string }>({
    mutationFn: ({ currentPassword, newPassword, confirmPassword }) =>
      changePassword(currentPassword, newPassword, confirmPassword),
  });

  const deleteAccountMutation = useMutation<void, ApiError, void>({
    mutationFn: () => deleteAccount(),
  });

  const simulatedDateMutation = useMutation<User, ApiError, { date: string | null }>({
    mutationFn: ({ date }) => updateSimulatedDate(date),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(QUERY_KEYS.PROFILE.ME, updatedUser);
      updateUser(updatedUser);
    },
  });

  return {
    user:         query.data ?? null,
    isLoading:    query.isPending,
    isRefreshing: query.isFetching && !query.isPending,
    isError:      query.isError,
    refetch:      query.refetch,
    updateMutation,
    changePasswordMutation,
    deleteAccountMutation,
    simulatedDateMutation,
  };
}
