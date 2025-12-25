export const WAIT_CONSTANTS = {
  SMALL: 200,
  MEDIUM: 500,
  LARGE: 1000,
  AFTER_SUBMIT: 1500,
  NETWORK_TIMEOUT: 10000,
} as const;

export type WaitTimes = typeof WAIT_CONSTANTS;

export interface WaitStrategyOptions {
  timeout?: number;
  state?: 'attached' | 'detached' | 'visible' | 'hidden';
}

export class TestWaiter {
  constructor(private waitTimes: WaitTimes = WAIT_CONSTANTS) {}

  getWaitTime(level: 'small' | 'medium' | 'large' | 'afterSubmit'): number {
    const key = level === 'afterSubmit' ? 'AFTER_SUBMIT' : level.toUpperCase();
    return this.waitTimes[key as keyof WaitTimes];
  }

  async forResponse(
    page: any,
    urlPattern: string | RegExp | ((url: URL) => boolean),
    options: { timeout?: number } = {}
  ): Promise<Response> {
    return page.waitForResponse(
      (response: Response) => {
        const url = response.url();
        if (typeof urlPattern === 'string') {
          return url.includes(urlPattern);
        } else if (urlPattern instanceof RegExp) {
          return urlPattern.test(url);
        } else if (typeof urlPattern === 'function') {
          return urlPattern(new URL(url));
        }
        return false;
      },
      { timeout: this.waitTimes.NETWORK_TIMEOUT, ...options }
    );
  }

  async forAnyResponse(
    page: any,
    urlPatterns: Array<string | RegExp>,
    options: { timeout?: number } = {}
  ): Promise<Response> {
    return page.waitForResponse(
      (response: Response) => {
        const url = response.url();
        return urlPatterns.some(pattern => {
          if (typeof pattern === 'string') return url.includes(pattern);
          if (pattern instanceof RegExp) return pattern.test(url);
          return false;
        });
      },
      { timeout: this.waitTimes.NETWORK_TIMEOUT, ...options }
    );
  }

  async forLoadState(page: any, state: 'load' | 'domcontentloaded' | 'networkidle' = 'domcontentloaded'): Promise<void> {
    await page.waitForLoadState(state);
    await this.wait('small');
  }

  async wait(level: 'small' | 'medium' | 'large' | 'afterSubmit'): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, this.getWaitTime(level)));
  }
}

export function createWaiter(customTimes?: Partial<WaitTimes>): TestWaiter {
  const waitTimes = { ...WAIT_CONSTANTS, ...customTimes };
  return new TestWaiter(waitTimes);
}