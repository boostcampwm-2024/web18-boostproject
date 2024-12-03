import { publicAPI } from '@/shared/api/publicAPI.ts';
import React, { useCallback, useState } from 'react';
import { Button } from '@/shared/ui/Button.tsx';
import { useParams } from 'react-router-dom';
import { CommentData } from '@/entities/comment/types';
const MAX_COMMENT_LENGTH = 200;

interface CommentInputProps {
  setCommentList: (value: React.SetStateAction<CommentData[]>) => void;
}

export function CommentInput({ setCommentList }: CommentInputProps) {
  const [text, setText] = useState<string>('');
  const { albumId } = useParams<{ albumId: string }>();
  if (!albumId) return;

  const handleTextChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      const inputValue = e.currentTarget.value;
      setText(inputValue);
    },
    [setText],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const trimmedText = text.trim();
      const isValidMessage =
        trimmedText && trimmedText.length <= MAX_COMMENT_LENGTH;

      if (isValidMessage) {
        const response = await publicAPI.createComment(albumId, trimmedText);
        if (response.success) {
          setCommentList((prev) => [response.commentResponse, ...prev]);
          setText('');
        }
      }
    },
    [text, albumId, setCommentList, setText],
  );

  if (!albumId) return null;

  return (
    <form
      className="flex justify-between items-baseline mb-12"
      onSubmit={handleSubmit}
    >
      <p className="w-20 mr-6">댓글 작성</p>
      <input
        type="text"
        className="bg-transparent border-b border-solid h-10 py-2 focus:outline-none flex-grow mr-16"
        placeholder="여기에 댓글을 입력해주세요"
        onChange={handleTextChange}
        value={text}
        maxLength={MAX_COMMENT_LENGTH}
      />
      <Button message="등록" type="submit" />
    </form>
  );
}
