import { useSocketStore } from '@/shared/store/useSocketStore';
import { useEffect } from 'react';
import { useVoteStore } from '@/shared/store/useVoteStore.ts';

export function useVote() {
  const { voteData, updateVote } = useVoteStore();
  const { socket } = useSocketStore();

  useEffect(() => {
    if (!socket) return;

    const handleVoteUpdate = (data: Record<string, string>) => {
      updateVote(data);
    };

    socket.on('voteUpdated', handleVoteUpdate);

    return () => {
      socket.off('voteUpdated', handleVoteUpdate);
    };
  }, [socket, updateVote]);

  return { voteData };
}
