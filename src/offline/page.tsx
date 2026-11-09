import { getTranslations } from 'next-intl/server';

export default async function OfflinePage() {
  const t = await getTranslations('Offline');

  return (
    <section>
      <h1>{t('title')}</h1>
      <p>{t('body')}</p>
    </section>
  );
}
