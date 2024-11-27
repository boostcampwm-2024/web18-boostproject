import { useParams } from 'react-router-dom';
import { AudioController } from '@/widgets/streaming/ui/AudioController';
import { PlayIcon } from '@/shared/icon/PlayIcon';
import { RoomResponse } from '@/entities/album/types';
import SampleAlbumCover from '@/assets/sample-album-cover-1.png';
import { useStreamingPlayer } from '@/features/albumStreaming/lib/useStreamingPlayer';

interface AlbumInfoProps {
  roomInfo: RoomResponse;
  songIndex: number;
  setSongIndex: (value: React.SetStateAction<number>) => void;
}

export function AlbumInfo({
  roomInfo,
  songIndex,
  setSongIndex,
}: AlbumInfoProps) {
  const { roomId } = useParams<{ roomId: string }>();
  if (!roomId) return;
  const { audioRef, isLoaded, playStream } = useStreamingPlayer(
    roomId,
    setSongIndex,
  );

  // if (!roomInfo.success) {
  //   return <StreamingErrorPage />;
  // }

  return (
    <div className="flex flex-col items-center relative text-grayscale-100">
      <audio ref={audioRef} controls controlsList="nodownload" />
      <div className="text-center mb-20 w-full">
        <p className="text-gray-300 mb-4">
          #{roomInfo.albumResponse.tags.split(', ').join(' #')}
        </p>
        <p className="text-3xl font-bold mb-4">
          {roomInfo.albumResponse.title}
        </p>
        <p>{roomInfo.albumResponse.artist}</p>
      </div>
      <div className="relative flex flex-col items-center">
        {/* <p className="text-sm mb-3">{album.currentTime}</p> */}
        <div className="relative flex justify-center items-center">
          <img
            src={roomInfo.albumResponse.jacketUrl ?? SampleAlbumCover}
            alt="Album Cover"
            className="w-52 h-52 object-cover rounded-t-lg"
          />
          {!isLoaded && (
            <>
              <button
                className="z-10 absolute px-4 py-2 rounded-lg text-xl bg-gray-700"
                onClick={playStream}
              >
                <PlayIcon />
              </button>
              <div className="bg-gray-900 absolute top-0 w-full h-full opacity-70"></div>
            </>
          )}
        </div>
        <div className="absolute bottom-0 w-full">
          <AudioController
            audioRef={audioRef}
            songDuration={roomInfo.songResponseList[songIndex - 1].duration}
          />
        </div>
      </div>
      <p className="mt-4 text-2xl font-bold">
        {roomInfo.songResponseList[songIndex - 1].title}
      </p>
    </div>
  );
}
