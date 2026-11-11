import { getTranslations } from 'next-intl/server';
import { ShieldCheck } from 'lucide-react';

import LoginForm from '@/features/auth/LoginForm';

export async function generateMetadata() {
  return { title: (await getTranslations('Login'))('title') };
}

export default async function LoginPage() {
  const t = await getTranslations('Login');

  return (
    <main className="d-flex justify-content-center align-items-center min-vh-100 p-6">
      <div className="card border-0 shadow-lg pop-enter p-4" style={{ width: '400px' }}>
        <div className="d-flex align-items-center gap-2 mb-3 fw-bold text-uppercase text-primary">
          <ShieldCheck size={28} aria-hidden /> Inventory
        </div>

        <h1 className="fs-4 mb-1">{t('title')}</h1>
        <p className="fg-5 mb-4">{t('subtitle')}</p>

        <LoginForm />
      </div>
    </main>
  );
}
