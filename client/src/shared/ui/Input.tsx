interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  labelName: string;
  type?: string;
  placeholder?: string;
}

export function Input({
  labelName,
  type = 'text',
  placeholder = '',
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-grayscale-100 text-sm">{labelName}</label>
      <input
        className="focus:outline-none px-4 py-2 rounded"
        type={type}
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
}
