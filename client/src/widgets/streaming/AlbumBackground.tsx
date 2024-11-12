interface AlbumBackgroundProps {
  coverImage: string;
}

export function AlbumBackground({ coverImage }: AlbumBackgroundProps) {
  return (
    <>
      <img
        src={coverImage}
        className="absolute inset-0 w-full h-full object-cover scale-150 blur-lg"
        alt="Album Cover"
      />
      <div className="absolute inset-0 bg-grayscale-900 opacity-70"></div>
    </>
  );
}
