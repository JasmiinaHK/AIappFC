import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getTasks } from '../API/taskApi';
import { Material } from '../types/material';

export const useTasks = (email: string): UseQueryResult<Material[], Error> => {
  return useQuery({
    queryKey: ['tasks', email],
    queryFn: () => getTasks(email),
    enabled: !!email, // Only run the query if we have an email
    retry: false, // Don't retry on failure
    onError: (error) => {
      console.error('useTasks hook error:', error);
    }
  });
};
