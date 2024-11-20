import { useCallback, useState, useRef } from 'react';
import { CreateAlbumRequest, Song } from './types';

const SONG_FIELDS = [
  'title',
  'composer',
  'writer',
  'producer',
  'instrument',
  'trackNumber',
  'source',
  'lyrics',
] as const;

const ALBUM_FIELDS = [
  'title',
  'artist',
  'album_tag',
  'releaseDate',
  'releaseTime',
] as const;

function validateForm(formData: FormData, fields: readonly string[]) {
  return fields.every((field) => {
    const value = formData.get(field);
    return value !== null && value !== '';
  });
}
export function useAlbumForm() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [songFiles, setSongFiles] = useState<File[]>([]);
  const songFormRef = useRef<HTMLFormElement>(null);
  const albumFormRef = useRef<HTMLFormElement>(null);

  const handleAddSong = useCallback(() => {
    if (!songFormRef.current) return;

    const songFormData = new FormData(songFormRef.current);
    const songFile = songFormData.get('songFile') as File;

    // 필드가 비어있으면 경고창 띄우고 함수 종료
    if (!validateForm(songFormData, SONG_FIELDS) || !songFile.name) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    // FormData로부터 새로운 노래 객체 생성
    const newSong = SONG_FIELDS.reduce((acc, field) => {
      acc[field as keyof Song] = songFormData.get(field) as string;
      return acc;
    }, {} as Song);

    // 노래 추가 및 파일 추가
    setSongs((prev) => [...prev, newSong as Song]);
    setSongFiles((prev) => [...prev, songFile]);

    // 폼 리셋
    songFormRef.current.reset();
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      const albumFormData = new FormData(
        albumFormRef.current as HTMLFormElement,
      );

      const albumData: CreateAlbumRequest = ALBUM_FIELDS.reduce(
        (acc, field) => {
          if (field === 'album_tag') {
            acc[field] = (albumFormData.get(field) as string).split(',');
          } else {
            acc[field] = albumFormData.get(field) as string;
          }
          return acc;
        },
        {} as CreateAlbumRequest,
      );

      albumData.songs = songs;

      const albumImage = albumFormData.get('albumImage') as File;
      const bannerImage = albumFormData.get('bannerImage') as File;
      console.log(songFiles);

      // if (albumImage) {
      //   submitFormData.append('albumImage', albumImage);
      // }
      // songFiles.forEach((file) => {
      //   submitFormData.append('songFiles', file);
      // });

      // const response = await fetch('/api/albums', {
      //   method: 'POST',
      //   body: submitFormData,
      // });

      // if (!response.ok) {
      //   throw new Error('Failed to submit album data');
      // }

      // 성공 시 모든 상태 초기화
      setSongs([]);
      setSongFiles([]);
      // return await response.json();
    } catch (error) {
      console.error('Failed to submit form:', error);
      throw error;
    }
  }, [songs]);

  return { handleSubmit, handleAddSong, songs, songFormRef, albumFormRef };
}
