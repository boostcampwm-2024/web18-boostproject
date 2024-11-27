import { create } from 'zustand';

interface VoteState {
  voteData: Record<string, string>;
  updateVote: (voteData: Record<string, string>) => void;
}

export const useVoteStore = create<VoteState>((set) => ({
  voteData: {},
  updateVote: (voteData) =>
    set((state) => ({ voteData: { ...state.voteData, ...voteData } })),
}));
