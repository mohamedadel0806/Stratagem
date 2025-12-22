'use client';

import { useKeyboardNavigation } from '@/hooks/use-keyboard-navigation';
import { Button } from '@/components/ui/button';

/**
 * Skip to main content link for keyboard navigation
 * Appears when focused via Tab key
 */
export function SkipToContent() {
  const { skipToMainContent } = useKeyboardNavigation();

  return (
    <Button
      onClick={skipToMainContent}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground"
      aria-label="Skip to main content"
    >
      Skip to main content
    </Button>
  );
}


