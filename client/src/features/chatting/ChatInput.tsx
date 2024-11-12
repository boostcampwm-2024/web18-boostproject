import { SendIcon } from '@/shared/icons/SendIcon';

export default function ChatInput() {
  return (
    <div>
      <div className="flex flex-row">
        <input
          type="text"
          placeholder="채팅을 입력하세요"
          className="bg-gray-700 rounded-lg w-full p-3 mr-2 focus:outline-none"
        />
        <button>
          <SendIcon />
        </button>
      </div>
    </div>
  );
}
