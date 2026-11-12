import { currencySymbol, formatAmount } from '@/utils/format';
import { cn } from '@/utils/cn';
import { Money } from '@/types';

export const DEFAULT_CURRENCY = 'UAH' as const;

export default function PriceStack({
  prices,
  defaultSymbol = DEFAULT_CURRENCY,
  locale,
  className,
}: {
  prices: Money[];
  defaultSymbol?: Money['symbol'];
  locale: string;
  className?: string;
}) {
  const main = prices.find((p) => p.symbol === defaultSymbol) ?? prices[0];
  const others = prices.filter((p) => p !== main);

  return (
    <span className={cn('d-flex flex-column lh-sm', className)}>
      {others.map((p) => (
        <span key={p.symbol} className="text-body-secondary small">
          {formatAmount(p.value, locale)} {currencySymbol(p.symbol)}
        </span>
      ))}
      {main && (
        <span className="text-body">
          {formatAmount(main.value, locale)}
          <span className="ms-1 small text-uppercase">{currencySymbol(main.symbol)}</span>
        </span>
      )}
    </span>
  );
}
