import React from 'react';
import { signOut } from 'next-auth/react';

import useCurrentUser from '@/hooks/useCurrentUser';
import { useRouter } from 'next/router';

interface AccountMenuProps {
  visible?: boolean;
}

const AccountMenu: React.FC<AccountMenuProps> = ({ visible }) => {
  const { data: currentUser } = useCurrentUser();
  const router = useRouter();

  if (!visible) return null;

  return (
    <div
      className="bg-black w-56 absolute top-14 right-0 py-5 flex flex-col border-2 border-gray-800 rounded-md shadow-lg transition-opacity duration-300"
      role="menu"
      aria-label="Account menu"
    >
      <div className="flex flex-col gap-3">
        <div
          className="px-3 group/item flex flex-row gap-3 items-center w-full hover:bg-gray-700 rounded"
          role="menuitem"
          onClick={() => router.push('/profiles')}
        >
          <img className="w-8 rounded-md" src="/images/default-blue.png" alt={`${currentUser?.name}'s profile`} />
          <p className="text-white text-sm group-hover/item:underline">{currentUser?.name || 'User'}</p>
        </div>
      </div>
      <hr className="bg-gray-600 border-0 h-px my-4" />
      <button
        onClick={() => signOut()}
        className="px-3 text-center text-white text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
        role="menuitem"
      >
        Sign out of Netflix
      </button>
    </div>
  );
};

export default AccountMenu;