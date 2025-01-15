import { useQuery } from '@tanstack/react-query';
import { getMaterials } from '../API/materialApi';
import { Material } from '../types/material';

interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const useTasks = (email: string | null) => {
  return useQuery<PaginatedResponse<Material>>({
    queryKey: ['materials', email] as const,
    queryFn: () => {
      if (!email) {
        throw new Error('Email is required');
      }
      return getMaterials(email);
    },
    enabled: !!email,
    retry: 1,
    staleTime: 30000 // Consider data fresh for 30 seconds
  });
};
