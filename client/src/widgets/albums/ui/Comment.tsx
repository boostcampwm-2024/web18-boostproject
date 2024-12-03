interface CommentProps {
  comment: { content: string; createdAt: Date };
  index: number;
}

export function Comment({ comment, index }: CommentProps) {
  const date: Date = new Date(comment.createdAt);
  const dateFormat = `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
  return (
    <article className={'w-full flex justify-between mb-4 overflow-hidden'}>
      <p className={'w-[80px] mr-[24px] flex-shrink-0'}>익명 #{index + 1}</p>
      <p className={'word-break break-all flex-grow'}>{comment.content}</p>
      <p className={'w-[90px] ml-[24px] flex-shrink-0'}>{dateFormat}</p>
    </article>
  );
}
