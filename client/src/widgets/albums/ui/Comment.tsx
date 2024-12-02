interface CommentProps {
  comment: { content: string; createdAt: Date };
  index: number;
}

export function Comment({ comment, index }: CommentProps) {
  const date: Date = new Date(comment.createdAt);
  const dateFormat = `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
  return (
    <article className={'flex justify-between mb-4'}>
      <p>익명 #{index + 1}</p>
      <p className={'w-[80%]'}>{comment.content}</p>
      <p>{dateFormat}</p>
    </article>
  );
}
