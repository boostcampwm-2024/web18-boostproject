import { create } from 'zustand';
import { VoteActions, VoteState, VoteType } from './state/voteState';

const INITIAL_STATE: VoteType = {
  votes: {},
  trackNumber: '',
};

export const useVoteStore = create<VoteState & VoteActions>((set) => ({
  voteData: {
    votes: {},
    trackNumber: '',
  },

  showVote: (voteData: VoteType) =>
    set((state) => ({
      voteData: {
        ...state.voteData,
        ...voteData,
      },
    })),

  updateVote: (voteData: VoteType) =>
    set((state) => ({
      voteData: {
        ...state.voteData,
        votes: voteData.votes,
      },
    })),

  reset: () => set({ voteData: INITIAL_STATE }),
}));
