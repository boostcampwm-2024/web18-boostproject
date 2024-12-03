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
    <div className="w-full text-grayscale-50 border-t border-grayscale-700 border-solid">
      <p className={'text-4xl font-bold mb-[32px] mt-[64px]'}>
        코멘트
        <span className={'ml-6 text-sm font-normal text-grayscale-400'}>
          최신 10개의 댓글만 조회합니다.
        </span>
      </p>
      <form className={'flex justify-between items-baseline mb-12 '}>
        <p className={'w-[120px]'}>익명 댓글</p>
        <input
          name={'content'}
          className={
            'bg-transparent border-b border-solid w-full h-10 py-2 focus:outline-none flex-grow'
          }
          placeholder={'여기에 댓글을 입력해주세요.'}
          maxLength={200}
        />
        <input
          className={
            'bg-grayscale-50 text-grayscale-900 border-none rounded-lg px-4 py-2 ml-10 cursor-pointer'
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
