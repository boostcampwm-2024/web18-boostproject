import { SwiperSlide } from 'swiper/react';
import { bannerData } from '@/entities/room/types';
import 'swiper/css';
import 'swiper/css/pagination';
import { useNavigate } from 'react-router-dom';

interface BannerSlideProps {
  banner: bannerData;
}

function splitDate(date: string) {
  const [dateString, timeString] = date.split('T');
  const [_, month, day] = dateString.split('-');
  return `${month}월 ${day}일 ${timeString.slice(0, 5)}`;
}

export function BannerSlide({ banner }: BannerSlideProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/album/${banner.albumId}`);
  };

  return (
    <div className="relative" onClick={handleClick}>
      <img
        src={banner.bannerImageUrl}
        alt={`스트리밍 진행 중인 ${banner.albumName} 이미지`}
        className="w-full h-full object-cover"
      />
      <div className="absolute top-0 left-0 text-grayscale-100 z-10 w-1/4 min-h-full p-4 flex flex-col justify-between">
        <div>
          <div className="flex flex-row gap-2 text-sm mb-1">
            <p className="font-bold bg-red-500 px-1">LIVE</p>
            <p className="text-red-600">{banner.currentUserCount} 명</p>
          </div>
          <p className="text-gray-400 break-words">
            #{banner.albumTags?.split(',').join(' #')}
          </p>
          <p className="font-black text-3xl w-44">{banner.albumName}</p>
        </div>
        <div>
          <p className="font-bold text-2xl">{banner.artist}</p>
          <p className="text-gray-400 text-sm">
            {splitDate(banner.releaseDate)} 예정
          </p>
        </div>
      </div>
    </div>
  );
}
