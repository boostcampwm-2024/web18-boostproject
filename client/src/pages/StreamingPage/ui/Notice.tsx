export function Notice({ message, title }: { message: string; title: string }) {
  return (
    <div className="absolute top-[5.5rem] w-[276px] right-0 bg-grayscale-700 text-grayscale-100  z-10 mx-8 rounded-lg">
      <div className="flex flex-row items-center justify-between px-5 py-3 rounded-lg">
        <div className="mr-2">
          <p className="text-grayscale-300">{title}</p>
          <p className="text-lg font-semibold">{message}</p>
        </div>
      </div>
    </div>
  );
}
