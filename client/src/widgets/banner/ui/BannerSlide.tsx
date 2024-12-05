import { bannerData } from '@/entities/room/types';
import 'swiper/css';
import 'swiper/css/pagination';
import { useNavigate } from 'react-router-dom';
import { compareDate, convertToKTC, splitDate } from '@/shared/util/timeUtils';

interface BannerSlideProps {
  banner: bannerData;
}

export function BannerSlide({ banner }: BannerSlideProps) {
  const navigate = useNavigate();
  const handleClick = () => {
    if (!banner.albumId) return;
    navigate(`/streaming/${banner.albumId}`);
  };
  const checkLive = compareDate(new Date(), new Date(banner.releaseDate)) > 0;
  return (
    <div className="relative rounded-lg" onClick={handleClick}>
      <img
        src={banner.bannerImageUrl}
        alt={`스트리밍 진행 중인 ${banner.albumName} 이미지`}
        className={`w-full h-full object-cover ${banner.albumId ? 'cursor-pointer' : ''}`}
      />
      {banner.albumId && (
        <div className="absolute top-0 left-0 text-grayscale-100 z-10 w-1/4 min-h-full p-4 flex flex-col justify-between select-none cursor-pointer">
          <div>
            <div className="flex flex-row gap-2 text-sm mb-1">
              <p
                className={`font-bold px-1 ${checkLive ? 'bg-red-600' : 'bg-grayscale-400'}`}
              >
                LIVE
              </p>
              {checkLive && (
                <p className="text-red-600">{banner.currentUserCount} 명</p>
              )}
            </div>
            <p className="text-gray-400 break-words">
              #{banner.albumTags?.split(',').join(' #')}
            </p>
            <p className="font-black text-2xl w-44">{banner.albumName}</p>
          </div>
          <div>
            <p className="font-bold text-2xl">{banner.artist}</p>
            <p className="text-gray-400 text-sm">
              {splitDate(convertToKTC(banner.releaseDate))} 시작
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
