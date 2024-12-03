import { CATEGORIES } from '../model/types';
import { ChevronDown } from '@/shared/icon/ChevronDown';
import { CategoryButton } from './CategoryButton';

interface SongDetailHeaderProps {
  category: string;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  setCategory: (value: string) => void;
}

export function SongDetailHeader({
  category,
  isOpen,
  setIsOpen,
  setCategory,
}: SongDetailHeaderProps) {
  const handleCategoryClick = (selectedCategory: string) => {
    if (!isOpen) {
      setIsOpen(true);
    }
    setCategory(selectedCategory);
  };
  return (
    <div className="flex flex-row justify-between px-6 py-4 items-center bg-grayscale-900 rounded-t-lg">
      <div className="flex flex-row space-x-4">
        <CategoryButton
          isActive={category === CATEGORIES.LYRICS}
          onClick={() => handleCategoryClick(CATEGORIES.LYRICS)}
        >
          가사
        </CategoryButton>
        <CategoryButton
          isActive={category === CATEGORIES.PLAYLIST}
          onClick={() => handleCategoryClick(CATEGORIES.PLAYLIST)}
        >
          플레이리스트
        </CategoryButton>
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`transform transition-transform duration-100 ease-in-out
      ${isOpen ? 'rotate-0' : 'rotate-180'}`}
      >
        <ChevronDown />
      </button>
    </div>
  );
}
