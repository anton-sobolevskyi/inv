'use client';
import { useTranslations } from 'next-intl';

import styles from './page.module.scss';

export default function Home() {
  const t = useTranslations('HomePage');

  return <div className={styles.page__wrapper}>{t('title')}</div>;
}
