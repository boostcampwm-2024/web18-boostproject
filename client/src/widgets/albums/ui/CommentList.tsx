import { Comment } from './Comment.tsx';
import { publicAPI } from '@/shared/api/publicAPI.ts';
import { Button } from '@/shared/ui';
import { useEffect, useState } from 'react';

interface CommentListProps {
  albumId: string;
}

export function CommentList({ albumId }: CommentListProps) {
  const [commentList, setCommentList] = useState<{ albumName: string }[]>([]);

  useEffect(() => {
    (async () => {
      const commentResponse = await publicAPI
        .getComment(albumId)
        .catch((err) => console.log(err));

      setCommentList(commentResponse.result.albumComments);
    })();
  }, [commentList]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dom = e.currentTarget.previousElementSibling;
    const response = publicAPI.createComment(albumId, dom.value);

    response.then((res) => {
      alert('댓글이 등록되었습니다.');
      setCommentList([dom.value, ...commentList]);
      dom.parentElement.reset();
    });
  };

  return (
    <div className="w-full text-grayscale-50 border-t border-grayscale-700 border-solid">
      <p className={'text-4xl font-bold mb-8 mt-14'}>
        코멘트
        <span className={'ml-6 text-sm font-normal text-grayscale-400'}>
          최신 10개의 댓글만 조회합니다.
        </span>
      </p>
      <form className={'flex justify-between items-baseline mb-12'}>
        <p className={'w-20 mr-6'}>댓글 작성</p>
        <input
          name={'content'}
          className={
            'bg-transparent border-b border-solid h-10 py-2 focus:outline-none flex-grow mr-16'
          }
          placeholder={'여기에 댓글을 입력해주세요.'}
          maxLength={200}
        />
        <Button type={'submit'} message={'등록'} onClick={handleSubmit} />
      </form>
      {commentList.map((comment, index) => (
        <Comment key={index} comment={comment} index={index} />
      ))}
    </div>
  );
}
