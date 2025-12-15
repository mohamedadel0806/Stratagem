import axios from 'axios';

/**
 * Construct the health endpoint URL
 * Handles different URL formats similar to login endpoint
 */
function getHealthEndpoint(baseUrl: string): string {
  const cleanUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
  
  // If URL already ends with /api/v1, just append /health
  if (cleanUrl.endsWith('/api/v1')) {
    return `${cleanUrl}/health`;
  }
  
  // If URL ends with /api (but not /api/v1), append /v1/health
  if (cleanUrl.endsWith('/api')) {
    return `${cleanUrl}/v1/health`;
  }
  
  // Default: append /api/v1/health
  // This handles direct backend URLs like http://backend:3001 or http://localhost:3001
  return `${cleanUrl}/api/v1/health`;
}

/**
 * Wait for backend to be ready by checking health endpoint
 */
export async function waitForBackendReady(
  baseUrl: string,
  maxAttempts: number = 30,
  delayMs: number = 1000
): Promise<boolean> {
  const healthEndpoint = getHealthEndpoint(baseUrl);
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await axios.get(healthEndpoint, {
        timeout: 2000,
      });
      
      if (response.status === 200 && (response.data?.status === 'ok' || response.data?.status === 'ready')) {
        return true;
      }
    } catch (error: any) {
      // Connection refused or timeout - backend not ready yet
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
        continue;
      }
    }
  }
  
  return false;
}

/**
 * Check if backend is ready (quick check, no retries)
 */
export async function isBackendReady(baseUrl: string): Promise<boolean> {
  try {
    const healthEndpoint = getHealthEndpoint(baseUrl);
    const response = await axios.get(healthEndpoint, {
      timeout: 2000,
    });
    return response.status === 200 && (response.data?.status === 'ok' || response.data?.status === 'ready');
  } catch {
    return false;
  }
}


