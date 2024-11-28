import { create } from 'zustand';

export type VoteType = { votes: Record<string, string>; trackNumber: string };

interface VoteState {
  voteData: VoteType;
  showVote: (voteData: VoteType) => void;
  updateVote: (voteData: VoteType) => void;
}

export const useVoteStore = create<VoteState>((set) => ({
  voteData: { votes: {}, trackNumber: '' },
  showVote: (voteData) =>
    set((state) => ({
      voteData: {
        ...state.voteData,
        ...voteData,
      },
    })),
  updateVote: (voteData) =>
    set((state) => ({
      voteData: {
        ...state.voteData,
        votes: voteData.votes,
      },
    })),
}));
