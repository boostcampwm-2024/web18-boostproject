import { useSuspenseQuery } from '@tanstack/react-query';
import { publicAPI } from '@/shared/api/publicAPI';
import { useLocation } from 'react-router-dom';
export const useSidebarAlbum = () => {
  const location = useLocation();
  return useSuspenseQuery({
    queryKey: ['albumSidebar', location.pathname],
    queryFn: async () => {
      const response = await publicAPI.getAlbumSidebar();
      return response.data.result;
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 10000,
    refetchInterval: 15000,
  });
};
