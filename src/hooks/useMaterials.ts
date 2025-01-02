import { useQuery } from '@tanstack/react-query';
import { getAllMaterials } from '../API/materialApi';

export const useMaterials = () => {
  return useQuery({
    queryKey: ['materials'],
    queryFn: getAllMaterials
  });
};