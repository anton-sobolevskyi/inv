import { formatDateLong, formatDateShort } from '@/utils/format';
import { cn } from '@/utils/cn';

export default function DateStack({
  value,
  locale,
  className,
}: {
  value: string;
  locale: string;
  className?: string;
}) {
  return (
    <span className={cn('d-flex flex-column lh-sm', className)}>
      <span className="text-body-secondary small">{formatDateShort(value)}</span>
      <span className="text-body">{formatDateLong(value, locale)}</span>
    </span>
  );
}
