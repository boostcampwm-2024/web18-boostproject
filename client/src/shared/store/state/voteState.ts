export type VoteType = { votes: Record<string, string>; trackNumber: string };

export interface VoteState {
  voteData: VoteType;
}

export interface VoteActions {
  showVote: (voteData: VoteType) => void;
  updateVote: (voteData: VoteType) => void;
  reset: () => void;
}
