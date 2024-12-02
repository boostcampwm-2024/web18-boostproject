import { useVoteStore } from '@/shared/store/useVoteStore';

export function useVote() {
  const voteData = useVoteStore((state) => state.voteData);
  return { voteData };
}
