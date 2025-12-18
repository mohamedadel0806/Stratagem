'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [currentLocale, setCurrentLocale] = useState('en');

  useEffect(() => {
    setMounted(true);
    // Extract locale from pathname
    const pathSegments = pathname.split('/').filter(Boolean);
    const locale = pathSegments[0] || 'en';
    setCurrentLocale(locale);
  }, [pathname]);

  const handleLanguageChange = (locale: string) => {
    // Simplified locale switching for App Router
    const newPath = pathname.replace(`/${currentLocale}`, `/${locale}`);
    router.push(newPath);
  };

  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

  // Render placeholder during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Globe className="h-4 w-4 mr-2" />
        {currentLanguage?.flag} {currentLanguage?.name}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <Globe className="h-4 w-4 mr-2" />
          {currentLanguage?.flag} {currentLanguage?.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={currentLocale === language.code ? 'bg-accent' : ''}
          >
            <span className="mr-2">{language.flag}</span>
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}