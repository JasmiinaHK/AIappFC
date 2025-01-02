import { useQuery } from '@tanstack/react-query';
import { getUserByEmail } from '../API/userApi';

export const useUser = (email: string) => {
  return useQuery({
    queryKey: ['user', email],
    queryFn: () => getUserByEmail(email)
  });
};