import { useSocketStore } from '@/shared/store/useSocketStore';
import { useEffect } from 'react';
import { useVoteStore, VoteType } from '@/shared/store/useVoteStore.ts';

export function useVote() {
  const { voteData, showVote, updateVote } = useVoteStore();
  const { socket } = useSocketStore();

  useEffect(() => {
    if (!socket) return;

    const handleVoteUpdate = (data: VoteType) => {
      updateVote(data);
    };

    const handleVoteShow = (data: VoteType) => {
      showVote(data);
    };

    socket.on('voteUpdated', handleVoteUpdate);
    socket.on('voteShow', handleVoteShow);

    return () => {
      socket.off('voteUpdated', handleVoteUpdate);
      socket.off('voteShow', handleVoteShow);
    };
  }, [socket, updateVote]);

  return { voteData };
}
