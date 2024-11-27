import { Swiper, SwiperSlide } from 'swiper/react';
import { BannerSlide } from './BannerSlide';
import { Pagination, Autoplay } from 'swiper/modules';
import { bannerData } from '@/entities/room/types';
import './Banner.css';
import 'swiper/css';
import 'swiper/css/pagination';

interface BannerProps {
  bannerList: bannerData[];
}

export function Banner({ bannerList }: BannerProps) {
  return (
    <div>
      <Swiper
        slidesPerView={'auto'}
        spaceBetween={50}
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        loop={true}
        className="banner-swiper"
        autoplay={{
          delay: 12000,
          disableOnInteraction: false,
        }}
      >
        {bannerList.map((banner) => (
          <SwiperSlide key={banner.albumId}>
            <BannerSlide banner={banner} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
