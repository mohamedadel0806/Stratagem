import axios, { AxiosInstance, AxiosError } from 'axios';
import { getSession } from 'next-auth/react';

// Determine API base URL based on Kong configuration
// USE_KONG=true: Use Kong API Gateway (http://localhost:8000 in dev, Kong base URL in prod)
// Kong routes /api/v1/* to backend, so endpoints should include /api/v1 in the base URL
// USE_KONG=false: Use Next.js proxy route (/api/proxy/api for the full path with /api endpoints)
const USE_KONG = process.env.NEXT_PUBLIC_USE_KONG === 'true';
let API_BASE_URL = USE_KONG
  ? (process.env.NEXT_PUBLIC_KONG_URL || 'http://localhost:8000')
  : (process.env.NEXT_PUBLIC_PROXY_URL || '/api/proxy/api');

// Ensure API_BASE_URL includes /api/v1 for Kong (backend has global prefix /api/v1)
// This normalizes the URL so endpoints are called correctly
if (USE_KONG && API_BASE_URL) {
  // Remove trailing slash if present
  API_BASE_URL = API_BASE_URL.replace(/\/$/, '');

  // Normalize to always end with /api/v1
  // Production examples:
  //   https://grc-staging.newmehub.com/api -> https://grc-staging.newmehub.com/api/v1
  //   https://grc-staging.newmehub.com/api/v1 -> (no change)
  // Local examples:
  //   http://localhost:8000 -> http://localhost:8000/api/v1
  //   http://localhost:8000/api -> http://localhost:8000/api/v1

  if (!API_BASE_URL.endsWith('/api/v1')) {
    if (API_BASE_URL.endsWith('/api')) {
      // Ends with /api, add /v1
      API_BASE_URL = `${API_BASE_URL}/v1`;
    } else {
      // Doesn't end with /api, add /api/v1
      API_BASE_URL = `${API_BASE_URL}/api/v1`;
    }
  }
}

// Fallback for build time when environment variables aren't set
const getApiUrl = () => {
  if (typeof window === 'undefined') {
    // During build time, return a valid URL to prevent URL construction errors
    return 'http://build-time-dummy-url.com/api';
  }
  return API_BASE_URL;
};

// Only log in browser environment, not during build
if (typeof window !== 'undefined') {
  console.log(`API Client Configuration:`, {
    useKong: USE_KONG,
    method: USE_KONG ? 'Kong Gateway' : 'Next.js Proxy',
    baseURL: API_BASE_URL,
    kongUrl: process.env.NEXT_PUBLIC_KONG_URL,
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
  });
}

// Create axios instance with build-time safety
const createSafeAxiosInstance = (baseURL: string) => {
  // Ensure baseURL is absolute and doesn't include locale
  let absoluteBaseURL = baseURL;
  if (typeof window !== 'undefined') {
    // If baseURL is relative, make it absolute using current origin
    if (!baseURL.startsWith('http://') && !baseURL.startsWith('https://')) {
      absoluteBaseURL = `${window.location.origin}${baseURL.startsWith('/') ? '' : '/'}${baseURL}`;
    }
    // Remove any locale prefix that might have been added (e.g., /en/ or /ar/)
    absoluteBaseURL = absoluteBaseURL.replace(/\/(en|ar)\//, '/');
    // Ensure no double slashes except after protocol
    absoluteBaseURL = absoluteBaseURL.replace(/([^:]\/)\/+/g, '$1');
  }

  const instance = axios.create({
    baseURL: absoluteBaseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 second timeout
    withCredentials: true, // Send cookies with requests
  });

  // Add request interceptor that prevents requests during build time
  instance.interceptors.request.use(
    (config) => {
      // During build time, return mock response instead of making HTTP request
      if (typeof window === 'undefined') {
        // Return a resolved promise with mock data to prevent build failures
        return Promise.resolve({
          ...config,
          __isMockResponse: true,
          data: {}, // Mock empty response data
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        });
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return instance;
};

// Create a separate client for auth endpoints that don't require token
const authClient = createSafeAxiosInstance(getApiUrl());

// The proxy endpoint handles all authentication
// No need to extract tokens on the client side

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = createSafeAxiosInstance(getApiUrl());

    // Add request interceptor - get JWT token from NextAuth session and fix URL issues
    this.client.interceptors.request.use(
      async (config) => {
        try {
          // Fix URL issues - ensure URL is relative to the baseURL path
          if (config.url) {
            let url = config.url.toString();

            // Remove locale prefix if present (e.g., /en/ or /ar/)
            url = url.replace(/^\/(en|ar)\//, '/');

            // CRITICAL: For axios with a baseURL that includes a path (like /api/v1),
            // the request URL must NOT start with a slash, otherwise axios will
            // treat it as relative to the domain root and strip the /api/v1 prefix.
            if (url.startsWith('/')) {
              url = url.substring(1);
            }

            // Remove redundant prefix if already present in url
            if (config.baseURL) {
              const baseURL = config.baseURL.toString();
              if (baseURL.endsWith('/api/v1') && url.startsWith('api/v1')) {
                url = url.replace(/^api\/v1\/?/, '');
              }
              else if (baseURL.endsWith('/api') && url.startsWith('api') && !baseURL.endsWith('/api/v1')) {
                url = url.replace(/^api\/?/, '');
              }
            }

            config.url = url;
          }

          // Only try to get session in browser environment
          if (typeof window !== 'undefined') {
            const session = await getSession();
            if (session?.accessToken) {
              config.headers.Authorization = `Bearer ${session.accessToken}`;
            }
          }
        } catch (error) {
          // Silently ignore session errors (e.g., during build time)
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          console.warn('Unauthorized request:', error.config?.url);
        }
        return Promise.reject(error);
      }
    );
  }

  get instance(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient().instance;

