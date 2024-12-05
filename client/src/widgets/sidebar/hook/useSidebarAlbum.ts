import { useQuery } from '@tanstack/react-query';
import { publicAPI } from '@/shared/api/publicAPI';
import { useLocation } from 'react-router-dom';
export const useSidebarAlbum = () => {
  const location = useLocation();
  return useQuery({
    queryKey: ['albumSidebar', location.pathname],
    queryFn: () => publicAPI.getAlbumSidebar(),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 10000,
    refetchInterval: 15000,
    throwOnError: true,
  });
};
