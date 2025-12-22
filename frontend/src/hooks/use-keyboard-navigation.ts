'use client';

import { useEffect, useCallback, useRef } from 'react';

/**
 * Hook for managing keyboard navigation and accessibility
 * Provides keyboard shortcuts and focus management
 */
export function useKeyboardNavigation() {
  const containerRef = useRef<HTMLElement | null>(null);

  /**
   * Trap focus within a container (useful for modals/dialogs)
   */
  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    return () => container.removeEventListener('keydown', handleTabKey);
  }, []);

  /**
   * Handle Escape key to close modals/dialogs
   */
  const useEscapeKey = useCallback((callback: () => void) => {
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          callback();
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [callback]);
  }, []);

  /**
   * Handle Enter key on interactive elements
   */
  const useEnterKey = useCallback((callback: () => void, enabled = true) => {
    useEffect(() => {
      if (!enabled) return;

      const handleEnter = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          callback();
        }
      };

      document.addEventListener('keydown', handleEnter);
      return () => document.removeEventListener('keydown', handleEnter);
    }, [callback, enabled]);
  }, []);

  /**
   * Skip to main content (accessibility feature)
   */
  const skipToMainContent = useCallback(() => {
    const mainContent = document.querySelector('main') || document.querySelector('[role="main"]');
    if (mainContent) {
      (mainContent as HTMLElement).focus();
      (mainContent as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  /**
   * Announce to screen readers
   */
  const announceToScreenReader = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  return {
    containerRef,
    trapFocus,
    useEscapeKey,
    useEnterKey,
    skipToMainContent,
    announceToScreenReader,
  };
}


