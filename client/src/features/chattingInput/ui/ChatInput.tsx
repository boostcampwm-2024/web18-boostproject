import { SendIcon } from '@/shared/icon/SendIcon';
import { sendMessage } from '../model/sendMessage';
import { useState, FormEvent, memo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useSocketStore } from '@/shared/store/useSocketStore';

const CHAT_CONFIG = {
  TEXT_LIMIT: 150,
  TEXT_LIMIT_MESSAGE: '채팅은 150자 이하만 가능합니다',
} as const;

export const ChatInput = memo(() => {
  const [message, setMessage] = useState('');
  const [isTextOver, setIsTextOver] = useState(false);
  const { roomId } = useParams<{ roomId: string }>();
  const { socket } = useSocketStore();

  const handleMessageChange = useCallback((e: FormEvent<HTMLInputElement>) => {
    const inputValue = e.currentTarget.value;
    setMessage(inputValue);
    setIsTextOver(inputValue.length >= CHAT_CONFIG.TEXT_LIMIT);
  }, []);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const trimmedMessage = message.trim();
      const isValidMessage =
        trimmedMessage &&
        roomId &&
        socket?.connected &&
        trimmedMessage.length <= CHAT_CONFIG.TEXT_LIMIT;

      if (isValidMessage) {
        sendMessage(trimmedMessage, roomId);
        setMessage('');
        setIsTextOver(false);
      }
    },
    [message, roomId, socket],
  );

  const isSubmitDisabled = !socket?.connected || isTextOver;

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-row items-center">
        <input
          type="text"
          placeholder="채팅을 입력하세요"
          className="bg-grayscale-700 rounded-lg w-full p-3 mr-2 focus:outline-none"
          onChange={handleMessageChange}
          value={message}
          maxLength={CHAT_CONFIG.TEXT_LIMIT}
        />
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="disabled:opacity-50"
        >
          <SendIcon />
        </button>
      </div>
      {isTextOver && (
        <div className="text-red-500 text-sm absolute bottom-[14px]">
          {CHAT_CONFIG.TEXT_LIMIT_MESSAGE}
        </div>
      )}
    </form>
  );
});
