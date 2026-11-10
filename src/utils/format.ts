export const getFormattedTime = (date: Date, locale: string = 'en-GB') =>
  new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);

export const getFormattedDate = (date: Date, locale: string = 'en-GB') =>
  new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
