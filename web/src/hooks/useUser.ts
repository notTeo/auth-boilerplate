import { useQuery } from '@tanstack/react-query';
import { getMe } from '../api/user.api';

export const useUser = () =>
  useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    retry: false,
  });
