import { StreamingListItem } from '@/entities/streamingListItem';
import './StreamingList.css';
export default function StreamingList() {
  return (
    <ul className="flex flex-col gap-2 max-h-48 overflow-y-auto">
      {Array.from({ length: 10 }).map((_, index) => (
        <StreamingListItem key={index} />
      ))}
    </ul>
  );
}
