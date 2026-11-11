'use client';

import { loggedOut, useAppDispatch } from '@/lib/store';
import { logout } from '@/lib/api';
import { cn } from '@/utils/cn';
import { redirect } from 'next/navigation';

export default function LogoutLink() {
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    await logout();
    dispatch(loggedOut());
    redirect('/login');
  };

  return (
    <div className={cn('text-center')}>
      <button className={cn('btn btn-secondary')} onClick={() => handleLogout()}>
        Logout
      </button>
    </div>
  );
}
