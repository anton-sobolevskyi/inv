'use client';

import { Trash2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import './OrderRow.scss';
import { OrderListItem } from '@/types';
import { openModal, selectOrder, useAppDispatch } from '@/lib/store';
import DateStack from '@/ui/components/DateStack';
import PriceStack from '@/ui/components/PriceStack';
import { cn } from '@/utils/cn';

export default function OrderRow({
  order,
  selected,
}: {
  order: OrderListItem;
  selected: boolean;
  index?: number;
}) {
  const t = useTranslations('Orders');
  const locale = useLocale();
  const dispatch = useAppDispatch();
  const toggle = () => dispatch(selectOrder(selected ? null : order.id));

  return (
    <tr
      className={cn(
        'order-row position-relative d-grid align-items-center gap-4 border rounded-3 bg-body p-4 mb-3',
        {
          shadow: selected,
        }
      )}
      onClick={toggle}
    >
      <td className="order-row__title p-0 border-0 bg-transparent text-start text-truncate">
        {order.title}
      </td>

      <td className="order-row__count d-inline-flex align-items-center gap-3 text-body-secondary">
        <span className="d-flex flex-column lh-sm">
          <span className="d-block text-body fs-5 lh-1">{order.productsCount}</span>
          <span className="text-body-secondary small">
            {t('products', { count: order.productsCount })}
          </span>
        </span>
      </td>

      <td>
        <DateStack className="order-row__date" value={order.date} locale={locale} />
      </td>
      <td>
        <PriceStack className="order-row__sum" prices={order.totals} locale={locale} />
      </td>

      <td>
        <button
          type="button"
          className="d-inline-flex p-2 btn btn-outline-secondary order-row__delete"
          onClick={(e) => {
            e.stopPropagation();
            dispatch(openModal({ kind: 'deleteOrder', orderId: order.id, title: order.title }));
          }}
        >
          <Trash2 size={16} />
        </button>
      </td>
    </tr>
  );
}
