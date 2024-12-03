import { AlbumList } from '@/widgets/albums';
import { publicAPI } from '@/shared/api/publicAPI';
import { useEffect, useState } from 'react';
import { bannerData } from '@/entities/room/types';
import { Banner } from '@/widgets/banner';
import DefaultBanner from '@/assets/default-banner.webp';

const defaultBanner: bannerData = {
  albumId: '',
  albumName: '',
  albumTags: '',
  artist: '',
  bannerImageUrl: DefaultBanner,
  currentUserCount: 0,
  releaseDate: '',
};

export function MainPage() {
  const [bannerList, setBannerList] = useState<bannerData[]>([]);
  useEffect(() => {
    const getAlbumBanner = async () => {
      const res = await publicAPI
        .getAlbumBanner()
        .then((res) => res)
        .catch((err) => console.log(err));
      const filteredBannerList = res.result.bannerLists.filter(
        (banner: bannerData) => banner.bannerImageUrl,
      );
      setBannerList(
        filteredBannerList.length > 0
          ? [defaultBanner, ...filteredBannerList]
          : [defaultBanner],
      );
    };
    getAlbumBanner();
  }, []);
  return (
    <div className="px-20 py-14">
      <Banner bannerList={bannerList} />
      <AlbumList />
    </div>
  );
}
