import { AlbumArtist, CommentList, Playlist } from '@/widgets/albums';
import { publicAPI } from '@/shared/api/publicAPI.ts';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FastAverageColor } from 'fast-average-color';
import { darken } from 'polished';
import LogoAlbum from '@/assets/logo-album-cover.webp';
import { AlbumDetailData, SongDetailData } from '@/entities/comment/types';

export function AlbumPage() {
  const { albumId } = useParams<{ albumId: string }>();
  if (!albumId) return;

  const [songDetails, setSongDetails] = useState<SongDetailData[]>([]);
  const [albumJacketUrl, setAlbumJacketUrl] = useState(LogoAlbum);
  const [albumDetails, setAlbumDetails] = useState<AlbumDetailData | null>(
    null,
  );
  const [backgroundColor, setBackgroundColor] = useState<string>('#222');

  const totalDuration = songDetails.reduce(
    (total, acc) => total + Number(acc.songDuration),
    0,
  );

  useEffect(() => {
    (async () => {
      const albumResponse = await publicAPI
        .getAlbumInfo(albumId)
        .catch((err) => console.log(err));
      setAlbumDetails(albumResponse.result.albumDetails);
      setSongDetails([...albumResponse.result.songDetails]);
      setAlbumJacketUrl(
        albumResponse.result.albumDetails.jacketUrl ?? LogoAlbum,
      );
    })();
  }, [albumJacketUrl, albumId]);

  useEffect(() => {
    const fac = new FastAverageColor();
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = albumJacketUrl.replace(
      'https://inear-music.kr.object.ncloudstorage.com',
      '/images',
    );

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
      className="px-80 pt-16 flex flex-col w-full h-screen"
      style={{
        background: `linear-gradient(180deg, ${backgroundColor} 0%, rgba(0, 0, 0, 0) 20%)`,
      }}
    >
      <div className={'flex h-680 gap-20 mb-24 relative z-10'}>
        {albumDetails && (
          <article className={'w-[21.25rem] h-85 flex-shrink-0'}>
            <img
              id={'album-jacket'}
              src={albumJacketUrl}
              className={'w-[21.25rem] h-[21.25rem] select-none'}
              alt={`${albumDetails.albumName} 앨범 커버`}
            ></img>
            <p
              className={`${albumDetails.albumName?.length >= 12 ? 'text-2xl' : albumDetails.albumName?.length >= 10 ? 'text-3xl' : 'text-4xl'} text-grayscale-50 mt-8 truncate`}
              style={{ fontWeight: 900 }}
            >
              {albumDetails.albumName}
            </p>
            <AlbumArtist
              artist={albumDetails.artist}
              songLength={songDetails.length}
              totalDuration={totalDuration}
            />
          </article>
        )}
        <Playlist playlist={songDetails} />
      </div>
      <CommentList albumId={albumId} />
    </div>
  );
}
