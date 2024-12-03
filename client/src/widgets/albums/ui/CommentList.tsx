import { Comment } from './Comment.tsx';
import { publicAPI } from '@/shared/api/publicAPI.ts';
import { useEffect, useState } from 'react';
import { CommentInput } from '@/features/commentInput';
interface CommentListProps {
  albumId: string;
}

interface Comment {
  albumId: string;
  content: string;
  createdAt: string;
}

export function CommentList({ albumId }: CommentListProps) {
  const [commentList, setCommentList] = useState<Comment[]>([]);

  useEffect(() => {
    (async () => {
      const commentResponse = await publicAPI
        .getComment(albumId)
        .catch((err) => console.log(err));

      setCommentList(commentResponse.result.albumComments);
    })();
  }, []);

  console.log(commentList);
  return (
    <div className="w-full text-grayscale-50 border-t border-grayscale-700 border-solid">
      <p className="text-4xl font-bold mb-8 mt-14">
        코멘트
        <span className="ml-6 text-sm font-normal text-grayscale-400">
          최신 10개의 댓글만 조회합니다.
        </span>
      </p>
      <CommentInput setCommentList={setCommentList} />
      {commentList.slice(0, 10).map((comment, index) => (
        <Comment key={index} comment={comment} index={index} />
      ))}
    </div>
  );
}
