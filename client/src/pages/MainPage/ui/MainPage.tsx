import { AlbumList } from '@/widgets/albums';
import { publicAPI } from '@/shared/api/publicAPI';
import { useEffect, useState } from 'react';
import { bannerData } from '@/entities/room/types';
import { Banner } from '@/widgets/banner';

export function MainPage() {
  const [bannerList, setBannerList] = useState<bannerData[]>([]);
  useEffect(() => {
    const getAlbumBanner = async () => {
      const res = await publicAPI
        .getAlbumBanner()
        .then((res) => res)
        .catch((err) => console.log(err));
      setBannerList(
        res.result.bannerLists.filter(
          (banner: bannerData) => banner.bannerImageUrl,
        ),
      );
    };
    getAlbumBanner();
  }, []);
  return (
    <div className="p-8 pt-20">
      <Banner bannerList={bannerList} />
      <AlbumList />
    </div>
  );
}
