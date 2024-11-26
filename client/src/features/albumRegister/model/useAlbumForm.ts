import { useCallback, useState, useRef } from 'react';
import { CreateAlbumRequest, Song } from './types';
import { albumAPI } from '@/shared/api/adminAPI';

const REQUIRED_SONG_FIELDS = [
  'title',
  'composer',
  'writer',
  'producer',
  'instrument',
  'trackNumber',
  'source',
] as const;

const SONG_FIELDS = [...REQUIRED_SONG_FIELDS, 'lyrics'] as const;

const ALBUM_FIELDS = ['title', 'artist', 'albumTag', 'releaseDate'] as const;

function validateForm(formData: FormData, fields: readonly string[]): boolean {
  return fields.every((field) => {
    const value = formData.get(field);
    return value !== null && value !== '';
  });
}

function validateFile(file: File | null): boolean {
  return file !== null && file !== undefined && file.name !== '';
}

function createSongData(formData: FormData): Song {
  return SONG_FIELDS.reduce((acc, field) => {
    acc[field as keyof Song] = formData.get(field) as string;
    return acc;
  }, {} as Song);
}

function createAlbumData(
  formData: FormData,
  songs: Song[],
): CreateAlbumRequest {
  const albumData = ALBUM_FIELDS.reduce((acc, field) => {
    acc[field] = formData.get(field) as string;
    return acc;
  }, {} as CreateAlbumRequest);

  albumData.songs = songs;
  return albumData;
}

function createSubmitFormData(
  albumData: CreateAlbumRequest,
  albumCover: File,
  bannerCover: File,
  songFiles: File[],
): FormData {
  const submitFormData = new FormData();
  submitFormData.append('albumData', JSON.stringify(albumData));
  if (validateFile(albumCover)) {
    submitFormData.append('albumCover', albumCover);
  }
  if (validateFile(bannerCover)) {
    submitFormData.append('bannerCover', bannerCover);
  }
  songFiles.forEach((file) => {
    submitFormData.append('songs', file);
  });
  return submitFormData;
}

async function submitAlbumForm(submitFormData: FormData) {
  try {
    const response = await albumAPI.createAlbum(submitFormData);
    console.log(response);
  } catch (error) {
    console.error('[ERROR] 앨범 등록 실패:', error);
    throw error;
  }
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
    if (!validateForm(songFormData, REQUIRED_SONG_FIELDS) || !songFile.name) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    // FormData로부터 새로운 노래 객체 생성
    const newSong = createSongData(songFormData);

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

      if (!validateForm(albumFormData, ALBUM_FIELDS)) {
        alert('모든 필드를 입력해주세요.');
        return;
      }

      const submitFormData = createSubmitFormData(
        createAlbumData(albumFormData, songs),
        albumFormData.get('albumCover') as File,
        albumFormData.get('bannerCover') as File,
        songFiles,
      );
      console.log(...submitFormData);
      await submitAlbumForm(submitFormData);

      // 성공 시 모든 상태 초기화
      setSongs([]);
      setSongFiles([]);
    } catch (error) {
      console.error('[ERROR] 앨범 등록 실패:', error);
      alert('시스템 오류로 앨범 등록에 실패했습니다.');
      throw error;
    }
  }, [songs, songFiles]);

  return { handleSubmit, handleAddSong, songs, songFormRef, albumFormRef };
}
