'use client';

import { X } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';

import './Modal.scss';

export default function Modal({
  title,
  onClose,
  footer,
  children,
}: {
  title: string;
  onClose: () => void;
  footer: ReactNode;
  children?: ReactNode;
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div
      className="popup-backdrop position-fixed top-0 start-0 end-0 bottom-0 d-flex align-items-center justify-content-center p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="popup position-relative bg-body shadow-lg rounded overflow-auto">
        <button
          type="button"
          className="d-inline-flex btn p-2 btn-outline-secondary rounded-circle bg-white position-absolute top-0 end-0 m-3"
          onClick={onClose}
        >
          <X size={18} />
        </button>
        <h2 className="m-0 px-4 pt-4 pb-3 fw-bold fs-5">{title}</h2>
        {children}
        {footer}
      </div>
    </div>
  );
}
