'use client';

import { useAppSelector } from '@/lib/store';
import dynamic from 'next/dynamic';

const ConfirmDeleteModal = dynamic(() => import('./ConfirmModal'));

export default function ModalHost() {
  const modal = useAppSelector((s) => s.ui.modal);
  if (!modal) return null;

  switch (modal.kind) {
    case 'deleteOrder':
      return <ConfirmDeleteModal key={modal.kind} modal={modal} />;
  }
}
