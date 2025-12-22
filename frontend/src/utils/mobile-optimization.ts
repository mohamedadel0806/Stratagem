/**
 * Mobile optimization utilities
 * Provides helpers for touch-friendly interactions and mobile-specific optimizations
 */

/**
 * Minimum touch target size (44x44px recommended by WCAG)
 */
export const MIN_TOUCH_TARGET_SIZE = 44;

/**
 * Check if device is mobile
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768; // md breakpoint
}

/**
 * Check if device supports touch
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Get optimal font size for mobile readability
 */
export function getMobileFontSize(baseSize: number): number {
  return isMobileDevice() ? Math.max(baseSize, 16) : baseSize;
}

/**
 * Get optimal spacing for touch targets
 */
export function getTouchSpacing(): string {
  return isMobileDevice() ? 'gap-3' : 'gap-2';
}

/**
 * Get optimal button size class
 */
export function getTouchButtonSize(): string {
  return isMobileDevice() ? 'min-h-[44px] min-w-[44px]' : '';
}

/**
 * Format number for mobile display (abbreviate large numbers)
 */
export function formatMobileNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

/**
 * Debounce function for mobile performance
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for mobile performance
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}


