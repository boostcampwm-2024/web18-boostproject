interface CategoryButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export function CategoryButton({
  isActive,
  onClick,
  children,
}: CategoryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${isActive ? 'text-grayscale-100' : 'text-grayscale-500'}`}
    >
      {children}
    </button>
  );
}
