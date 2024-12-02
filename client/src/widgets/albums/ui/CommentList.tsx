import { Comment } from './Comment.tsx';

interface CommentListProps {
  commentList: { content: string; createdAt: Date }[];
}

export function CommentList({ commentList }: CommentListProps) {
  return (
    <div className="w-[100%] text-grayscale-50 border-t border-grayscale-700 border-solid">
      <p className={'text-4xl font-bold mb-[24px] mt-[64px]'}>코멘트</p>
      {commentList.map((comment, index) => (
        <Comment key={index} comment={comment} />
      ))}
    </div>
  );
}
