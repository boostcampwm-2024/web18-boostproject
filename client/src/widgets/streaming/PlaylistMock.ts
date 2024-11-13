interface playTrack {
  id: number;
  title: string;
  time: string;
  artist: string;
  composer?: string;
  Lyricist?: string;
  producer?: string;
  reference?: string;
}

export const playListData: playTrack[] = [
  {
    id: 1,
    title: 'Silently Completely Eternally',
    time: '03:30',
    artist: '코난',
    composer: '코난',
    Lyricist: '코난',
    producer: '코난',
    reference: '코난',
  },
  {
    id: 2,
    title: 'Hollywood Movie Star',
    time: '03:30',
    artist: '코난',
  },
  {
    id: 3,
    title: '29',
    time: '03:30',
    artist: '코난',
  },
  {
    id: 4,
    title: 'Behind the Trees',
    time: '03:30',
    artist: '코난',
  },
  {
    id: 5,
    title: 'SUPERNOVA!',
    time: '03:30',
    artist: '코난',
  },
  {
    id: 6,
    title: 'Star Communications',
    time: '03:30',
    artist: '코난',
  },
];
