import { create } from 'zustand';

export type VoteType = { votes: Record<string, string>; trackNumber: string };

interface VoteState {
  voteData: VoteType;
  updateVote: (voteData: VoteType) => void;
}

export const useVoteStore = create<VoteState>((set) => ({
  voteData: { votes: {}, trackNumber: '' },
  updateVote: (voteData) =>
    set((state) => ({ voteData: { ...state.voteData, ...voteData } })),
}));
