interface CommentProps {
  comment: { content: string; createdAt: Date };
}

export function Comment({ comment }: CommentProps) {
  const date: Date = new Date(comment.createdAt);
  const dateFormat = `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
  return (
    <article className={'flex justify-between'}>
      <p className={'w-[80%]'}>{comment.content}</p>
      <p>{dateFormat}</p>
    </article>
  );
}
