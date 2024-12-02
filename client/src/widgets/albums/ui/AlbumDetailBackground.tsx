import { FastAverageColor } from 'fast-average-color';
import { useEffect, useState } from 'react';
import { darken } from 'polished';

interface AlbumBackgroundProps {
  albumJacketUrl: string;
}

export function AlbumDetailBackground({
  albumJacketUrl,
}: AlbumBackgroundProps) {
  console.log(albumJacketUrl);
  const [backgroundColor, setBackgroundColor] = useState<string>('#222');

  useEffect(() => {
    const fac = new FastAverageColor();
    const img = new Image();
    img.crossOrigin = 'anonymous';
    const proxyUrl = albumJacketUrl.replace(
      'https://inear-music.kr.object.ncloudstorage.com',
      '/api-image',
    );
    img.src = proxyUrl;

    img.onload = () => {
      try {
        if (img.width === 0 || img.height === 0) {
          console.error('Image has no dimensions');
          return;
        }

        const color = fac.getColor(img, {
          algorithm: 'dominant', // 주요 색상 추출
          mode: 'precision', // 더 정확한 색상 계산
        });

        setBackgroundColor(darken(0.4, color.hex));
      } catch (e) {
        console.error('Color extraction failed:', e);
      }
    };

    return () => {
      img.onload = null; // 클린업
    };
  }, [albumJacketUrl]); // albumJacketUrl이 변경될 때마다 실행

  return (
    <div
      className={'absolute top-0 w-full h-[340px] z-[0]'}
      style={{
        background: `linear-gradient(180deg, ${backgroundColor} 0%, rgba(0, 0, 0, 0) 100%)`,
      }}
    ></div>
  );
}
