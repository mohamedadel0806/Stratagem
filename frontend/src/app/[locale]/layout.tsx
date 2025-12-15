import React from 'react';
import { languages } from '@/lib/i18n/settings';

export async function generateStaticParams() {
  return languages.map((locale) => ({ locale }));
}

// Helper function to get text direction
function getTextDirection(locale: string): 'ltr' | 'rtl' {
  // Explicitly set direction based on locale
  const rtlLocales = ['ar', 'he', 'fa', 'ur'];
  return rtlLocales.includes(locale) ? 'rtl' : 'ltr';
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Ensure locale defaults to 'en' if not provided
  const currentLocale = locale || 'en';
  const direction = getTextDirection(currentLocale);
  
  return (
    <div lang={currentLocale} dir={direction}>
      {children}
    </div>
  );
}