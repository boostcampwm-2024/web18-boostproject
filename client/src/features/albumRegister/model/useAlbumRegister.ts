import { useState, useCallback } from 'react';
import { socket } from '@/shared/api/socket';
import {
  CreateAlbumRequest,
  AlbumImageRequest,
  Song,
  SongFilesRequest,
} from './types.ts';

export function useAlbumRegister() {
  const [albumData, setAlbumData] = useState<CreateAlbumRequest>({
    title: '',
    artist: '',
    album_tag: [],
    releaseDate: '',
    releaseTime: '',
    songs: [],
  });
  const [songData, setSongData] = useState<Song>({
    title: '',
    trackNumber: '',
    lyrics: '',
    composer: '',
    playtime: '',
    writer: '',
    instrument: '',
    producer: '',
    source: '',
  });

  const [songList, setSongList] = useState<Song[]>([]);

  const handleAlbumDataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setAlbumData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSongDataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    console.log(name, value);
    setSongData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSong = useCallback(() => {
    if (songData.title.trim()) {
      setSongList((prev) => [...prev, { ...songData }]);
      setSongData({
        title: '',
        trackNumber: '',
        lyrics: '',
        composer: '',
        playtime: '',
        writer: '',
        instrument: '',
        producer: '',
        source: '',
      });
    }
  }, [songData]);

  const handleCreateRoom = async () => {
    try {
      socket.emit(
        'createRoom',
        {
          albumData,
          songs: songList,
        },
        (response: any) => {
          console.log('Room created:', response);
        },
      );
    } catch (error) {
      console.error('Failed to create room:', error);
    }
  };

  return {
    albumData,
    songData,
    songList,
    handleAlbumDataChange,
    handleSongDataChange,
    handleAddSong,
    handleCreateRoom,
  };
}
