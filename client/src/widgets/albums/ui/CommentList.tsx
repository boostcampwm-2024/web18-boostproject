import { Comment } from './Comment.tsx';
import { publicAPI } from '@/shared/api/publicAPI.ts';

interface CommentListProps {
  commentList: { content: string; createdAt: Date }[];
  albumId: string;
}

export function CommentList({ commentList, albumId }: CommentListProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = publicAPI.createComment(
      albumId,
      e.currentTarget.previousElementSibling.value,
    );
    console.log(response);
    response.then((res) => {
      alert('댓글이 등록되었습니다.');
      window.location.reload();
    });
  };

  return (
    <div className="w-[100%] text-grayscale-50 border-t border-grayscale-700 border-solid">
      <p className={'text-4xl font-bold mb-[24px] mt-[64px]'}>코멘트</p>
      <form className={'flex justify-between items-baseline mb-8 '}>
        <p className={'w-[120px] mr-4'}>익명의 사용자</p>
        <input
          name={'content'}
          className={
            'bg-transparent border-b border-solid w-full h-10 py-2 focus:outline-none'
          }
        />
        <input
          className={
            'bg-grayscale-50 text-grayscale-900 border-none rounded-lg px-4 py-2 ml-4 cursor-pointer'
          }
          type={'submit'}
          value={'등록'}
          onClick={handleSubmit}
        />
      </form>
      {commentList.map((comment, index) => (
        <Comment key={index} comment={comment} index={index} />
      ))}
    </div>
  );
}
