import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';
import { SerwistProvider } from '@serwist/turbopack/react';

import './globals.scss';

import StoreProvider from '@/providers/StoreProvider';
import { getSessionUser } from '@/utils/session';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const APP_NAME = 'Inventory';
const APP_DEFAULT_TITLE = 'My Awesome Inventory';
const APP_TITLE_TEMPLATE = '%s - Inventory';
const APP_DESCRIPTION = 'Best Inventory in the world!';

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: 'summary',
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
};

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  const locale = await getLocale();
  const user = await getSessionUser();

  return (
    <html lang={locale} className={`${geistSans.variable}`}>
      <body>
        <SerwistProvider swUrl="/serwist/sw.js">
          <NextIntlClientProvider>
            <StoreProvider user={user}>{children}</StoreProvider>
          </NextIntlClientProvider>
        </SerwistProvider>
      </body>
    </html>
  );
}
