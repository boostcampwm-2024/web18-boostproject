interface MessageData {
  userName: string;
  message: string;
  userId: string;
}

export function Message({ userName, message, userId }: MessageData) {
  return (
    <div className="text-sm pb-4">
      <span className="text-brand mr-1 whitespace-nowrap">{userName}</span>
      <span className="text-grayscale-400 mr-4 whitespace-nowrap">
        #{userId}
      </span>
      <span className="text-grayscale-100 break-words text-[2]">{message}</span>
    </div>
  );
}
