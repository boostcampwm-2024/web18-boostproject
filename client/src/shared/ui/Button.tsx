interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  message: string;
}

export function Button({ message, ...props }: ButtonProps) {
  return (
    <button
      className="bg-brand text-gray-900 font-semibold py-2 px-4 rounded"
      {...props}
    >
      {message}
    </button>
  );
}
