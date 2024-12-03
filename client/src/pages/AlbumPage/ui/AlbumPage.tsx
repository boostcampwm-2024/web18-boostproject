import { AlbumArtist, CommentList, Playlist } from '@/widgets/albums';
import { publicAPI } from '@/shared/api/publicAPI.ts';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FastAverageColor } from 'fast-average-color';
import { darken } from 'polished';

interface AlbumDetails {
  albumId: string;
  albumName: string;
  artist: string;
  jacketUrl: string;
}

export function AlbumPage() {
  const { albumId } = useParams<{ albumId: string }>();
  if (!albumId) return;

  const [songDetails, setSongDetails] = useState<
    { name: string; duration: string }[]
  >([]);
  const [albumJacketUrl, setAlbumJacketUrl] = useState<string>('LogoAlbum');
  const [commentList, setCommentList] = useState<{ albumName: string }[]>([]);
  const [albumDetails, setAlbumDetails] = useState<AlbumDetails>({});

  useEffect(() => {
    (async () => {
      const commentResponse = await publicAPI
        .getComment(albumId)
        .then((res) => res)
        .catch((err) => console.log(err));

      const albumResponse = await publicAPI
        .getAlbumInfo(albumId)
        .then((res) => res)
        .catch((err) => console.log(err));

      setAlbumDetails(albumResponse.result.albumDetails);
      setSongDetails(albumResponse.result.songDetails);
      setAlbumJacketUrl(albumResponse.result.albumDetails.jacketUrl);
      setCommentList(commentResponse.result.albumComments);
    })();
  }, [albumJacketUrl]);

  const [backgroundColor, setBackgroundColor] = useState<string>('#222');

  useEffect(() => {
    const fac = new FastAverageColor();
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = albumJacketUrl;

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

  const totalDuration = songDetails.reduce(
    (total, acc) => total + Number(acc.songDuration),
    0,
  );

  return (
    <div
      className={
        'pr-[64px] pt-[64px] pl-[40px] flex flex-col w-full min-w-[calc(100%-340px)]'
      }
      style={{
        background: `linear-gradient(180deg, ${backgroundColor} 0%, rgba(0, 0, 0, 0) 100%)`,
      }}
    >
      <div className={'flex h-680 gap-[80px] mb-[120px] relative z-[1]'}>
        <article className={'w-[340px] h-[340px] flex-shrink-0'}>
          <img
            id={'album-jacket'}
            src={albumJacketUrl}
            className={'w-[340px] h-[340px]'}
          ></img>
          <p
            className={`${albumDetails.albumName?.length >= 12 ? 'text-2xl' : albumDetails.albumName?.length >= 10 ? 'text-3xl' : 'text-4xl'} text-grayscale-50 mt-4 truncate`}
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
        <Playlist playlist={songDetails} />
      </div>
      <CommentList commentList={commentList} albumId={albumId} />
    </div>
  );
}
