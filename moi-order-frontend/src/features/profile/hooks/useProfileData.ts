import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchMe } from '@/shared/api/auth';
import { updateProfile, changePassword, deleteAccount } from '@/shared/api/profile';
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
  updateMutation: ReturnType<typeof useMutation<User, ApiError, { name: string; dateOfBirth: string | null }>>;
  changePasswordMutation: ReturnType<typeof useMutation<void, ApiError, { currentPassword: string; newPassword: string; confirmPassword: string }>>;
  deleteAccountMutation: ReturnType<typeof useMutation<void, ApiError, void>>;
}

export function useProfileData(): UseProfileDataResult {
  const queryClient = useQueryClient();
  const updateUser  = useAuthStore((s) => s.updateUser);

  const query = useQuery({
    queryKey: QUERY_KEYS.PROFILE.ME,
    queryFn:  fetchMe,
    staleTime: CACHE_TTL.USER_DATA,
  });

  const updateMutation = useMutation<User, ApiError, { name: string; dateOfBirth: string | null }>({
    mutationFn: ({ name, dateOfBirth }) => updateProfile(name, dateOfBirth),
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

  return {
    user:         query.data ?? null,
    isLoading:    query.isPending,
    isRefreshing: query.isFetching && !query.isPending,
    isError:      query.isError,
    refetch:      query.refetch,
    updateMutation,
    changePasswordMutation,
    deleteAccountMutation,
  };
}
