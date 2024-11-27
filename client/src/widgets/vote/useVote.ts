import { useSocketStore } from '@/shared/store/useSocketStore';
import { useEffect } from 'react';
import { useVoteStore, VoteType } from '@/shared/store/useVoteStore.ts';

export function useVote() {
  const { voteData, updateVote } = useVoteStore();
  const { socket } = useSocketStore();

  useEffect(() => {
    if (!socket) return;

    const handleVoteUpdate = (data: VoteType) => {
      updateVote(data);
    };

    socket.on('voteUpdated', handleVoteUpdate);

    return () => {
      socket.off('voteUpdated', handleVoteUpdate);
    };
  }, [socket, updateVote]);

  return { voteData };
}
