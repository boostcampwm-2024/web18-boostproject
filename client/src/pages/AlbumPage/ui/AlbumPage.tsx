import { CommentList, Playlist } from '@/widgets/albums';
import { publicAPI } from '@/shared/api/publicAPI.ts';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LogoAlbum from '@/assets/logo-album-cover.png';
import { AlbumDetailBackground } from '@/widgets/albums';

export function AlbumPage() {
  const { albumId } = useParams<{ albumId: string }>();
  if (!albumId) return;

  const [songDetails, setSongDetails] = useState<
    { name: string; duration: string }[]
  >([]);
  const [albumJacketUrl, setAlbumJacketUrl] = useState<string>('LogoAlbum');
  const [commentList, setCommentList] = useState<{ content: string }[]>([]);

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

      setSongDetails(albumResponse.result.songDetails);
      setAlbumJacketUrl(albumResponse.result.albumDetails.jacketUrl);

      setCommentList(commentResponse.result.albumComments);
    })();
  }, [albumJacketUrl]);

  return (
    <div className={'pr-[128px] pt-[64px]'}>
      <div className={'flex h-680 w-full gap-[80px] mb-[120px] relative z-[1]'}>
        <article className={'w-[340px] h-[340px] flex-shrink-0 ml-[40px]'}>
          <img
            id={'album-jacket'}
            src={albumJacketUrl}
            className={'w-[340px] h-[340px]'}
          ></img>
        </article>
        <Playlist playlist={songDetails} />
      </div>
      <CommentList commentList={commentList} />
      <AlbumDetailBackground albumJacketUrl={albumJacketUrl} />
    </div>
  );
}
