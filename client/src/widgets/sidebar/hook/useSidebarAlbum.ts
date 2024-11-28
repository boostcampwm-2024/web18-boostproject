import { useSuspenseQuery } from '@tanstack/react-query';
import { publicAPI } from '@/shared/api/publicAPI';
export const useSidebarAlbum = () => {
  return useSuspenseQuery({
    queryKey: ['albumSidebar'],
    queryFn: async () => {
      const response = await publicAPI.getAlbumSidebar();
      return response.result;
    },
    refetchOnWindowFocus: true,
  });
};
