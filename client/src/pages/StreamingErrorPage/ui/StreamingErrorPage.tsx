export function StreamingErrorPage({ message }: { message: string }) {
  return (
    <div className="flex flex-row h-screen text-grayscale-100 justify-center items-center w-full">
      {message}
    </div>
  );
}
