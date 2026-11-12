'use client';

import { useDeleteOrderMutation, useGetOrderDetailsQuery } from '@/hooks/useOrders';
import { closeModal, ModalState, useAppDispatch } from '@/lib/store';
import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import Modal from './Modal';
import ProductLine from './ProductLine';

type DeleteOrderModal = Extract<ModalState, { kind: 'deleteOrder' }>;

export default function ConfirmDeleteModal({ modal }: { modal: DeleteOrderModal }) {
  const t = useTranslations('Modals');
  const tc = useTranslations('Common');
  const dispatch = useAppDispatch();
  const [failed, setFailed] = useState(false);

  const { data: order } = useGetOrderDetailsQuery(modal.orderId);
  const [deleteOrder, { isLoading: pending }] = useDeleteOrderMutation();

  const close = () => dispatch(closeModal());

  const confirm = async () => {
    setFailed(false);
    try {
      await deleteOrder(modal.orderId).unwrap();
      close();
    } catch {
      setFailed(true);
    }
  };

  return (
    <Modal
      title={t('deleteOrderTitle')}
      onClose={close}
      footer={
        <div className="d-flex flex-wrap align-items-center justify-content-end gap-3 px-4 py-4">
          {failed && (
            <span className="me-auto small text-white fw-semibold">{t('deleteFailed')}</span>
          )}
          <button
            type="button"
            className="btn p-2 align-items-center btn-outline-secondary"
            onClick={close}
          >
            {tc('cancel')}
          </button>
          <button
            type="button"
            className="d-inline-flex p-2 align-items-center gap-1 btn btn-danger"
            onClick={confirm}
            disabled={pending}
          >
            <Trash2 size={16} className="me-1" />
            {pending ? t('deleting') : tc('delete')}
          </button>
        </div>
      }
    >
      <p className="px-4 pb-3 m-0 text-body-secondary small">
        <strong>{modal.title}</strong>
        <br />
        {order && order.products.length === 0 ? t('deleteOrderNoProducts') : t('deleteOrderHint')}
      </p>
      {order && order.products.length > 0 && (
        <ul className="list-unstyled m-0 p-0 border-top">
          {order.products.map((p) => (
            <ProductLine key={p.id} product={p} />
          ))}
        </ul>
      )}
    </Modal>
  );
}
