import { useSocketStore } from '@/shared/store/useSocketStore';
import Person from '@/shared/icon/Person';
import React from 'react';

export const UserCounter = React.memo(
  function UserCounter() {
    const userCount = useSocketStore((state) => state.userCount);
    return (
      <div className="flex items-center gap-2">
        <Person />
        <span className="text-lg">{userCount}명</span>
      </div>
    );
  },
  (prevProps, nextProps) => true,
);
