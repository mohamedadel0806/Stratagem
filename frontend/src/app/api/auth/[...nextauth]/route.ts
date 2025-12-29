import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios, { AxiosError } from "axios";
import { waitForBackendReady } from "@/lib/api/health-check";

/**
 * Get the backend base URL for server-side API calls
 * Priority: BACKEND_URL > NEXT_PUBLIC_API_URL > localhost fallback
 */
function getBackendBaseUrl(): string {
  // Prefer BACKEND_URL for direct backend connection (works in Docker networks)
  if (process.env.BACKEND_URL) {
    return process.env.BACKEND_URL;
  }

  // Fall back to NEXT_PUBLIC_API_URL if BACKEND_URL is not set
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Fallback to localhost for local development
  return 'http://localhost:3001';
}

/**
 * Construct the login endpoint URL
 * Handles different URL formats:
 * - Direct backend: http://backend:3001 -> http://backend:3001/api/v1/auth/login
 * - API gateway: https://domain.com/api -> https://domain.com/api/v1/auth/login
 * - Already has /api/v1: http://backend:3001/api/v1 -> http://backend:3001/api/v1/auth/login
 */
function getLoginEndpoint(baseUrl: string): string {
  const cleanUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash

  // If URL already ends with /api/v1, just append /auth/login
  if (cleanUrl.endsWith('/api/v1')) {
    return `${cleanUrl}/auth/login`;
  }

  // If URL ends with /api (but not /api/v1), append /v1/auth/login
  // This handles API gateway URLs like https://domain.com/api
  if (cleanUrl.endsWith('/api')) {
    return `${cleanUrl}/v1/auth/login`;
  }

  // Default: append /api/v1/auth/login
  // This handles direct backend URLs like http://backend:3001 or http://localhost:3001
  return `${cleanUrl}/api/v1/auth/login`;
}

const API_BASE_URL = getBackendBaseUrl();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Wait for backend to be ready (up to 30 seconds)
        console.log(`Waiting for backend to be ready at ${API_BASE_URL}...`);
        const backendReady = await waitForBackendReady(API_BASE_URL, 30, 1000);
        if (!backendReady) {
          console.error(`Backend not ready after 30 seconds at ${API_BASE_URL}`);
          // Return null instead of throwing - NextAuth will show proper error
          return null;
        }
        console.log(`Backend is ready at ${API_BASE_URL}`);

        // Retry logic for connection errors
        const maxRetries = 3;
        let lastError: any = null;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            console.log(`Attempting login for: ${credentials.email} (attempt ${attempt}/${maxRetries})`);
            console.log(`API URL: ${API_BASE_URL}`);

            const loginEndpoint = getLoginEndpoint(API_BASE_URL);
            console.log(`Using login endpoint: ${loginEndpoint}`);

            const response = await axios.post(
              loginEndpoint,
              {
                email: credentials.email,
                password: credentials.password,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
                timeout: 10000, // 10 second timeout
              }
            );

            console.log("Login response received:", response.status);
            const data = response.data;

            if (data.mfaRequired) {
              console.log("MFA Required for user:", data.userId);
              throw new Error(JSON.stringify({ mfaRequired: true, userId: data.userId }));
            }

            if (!data.user || !data.accessToken) {
              console.error("Invalid response structure:", data);
              return null;
            }

            const userData = {
              id: data.user.id,
              email: data.user.email,
              name: `${data.user.firstName} ${data.user.lastName}`,
              role: data.user.role,
              tenantId: data.user.tenantId,
              accessToken: data.accessToken,
            };
            console.log("✅✅✅ AUTHORIZE SUCCESS - Returning user object:", {
              id: userData.id,
              email: userData.email,
              hasAccessToken: !!userData.accessToken,
              accessTokenLength: userData.accessToken?.length,
              role: userData.role,
              tenantId: userData.tenantId,
              userDataKeys: Object.keys(userData),
            });
            return userData;
          } catch (error: any) {
            lastError = error;
            const axiosError = error as AxiosError;

            // Check if it's a connection error (ECONNREFUSED, ETIMEDOUT, etc.)
            const isConnectionError =
              error?.code === 'ECONNREFUSED' ||
              error?.code === 'ETIMEDOUT' ||
              error?.code === 'ENOTFOUND' ||
              error?.message?.includes('connect') ||
              axiosError.code === 'ECONNREFUSED';

            if (isConnectionError && attempt < maxRetries) {
              // Exponential backoff: wait 1s, 2s, 4s
              const delay = Math.pow(2, attempt - 1) * 1000;
              console.warn(`Connection error on attempt ${attempt}, retrying in ${delay}ms...`, error?.message);
              await new Promise(resolve => setTimeout(resolve, delay));
              continue;
            }

            // For non-connection errors (401, 400, etc.) or final attempt, log and return
            console.error("Login error:", error?.response?.data || error?.message || error);
            console.error("Error details:", {
              status: error?.response?.status,
              statusText: error?.response?.statusText,
              data: error?.response?.data,
              url: error?.config?.url,
              code: error?.code,
              message: error?.message,
            });

            // If it's a connection error on final attempt, return null with error message
            if (isConnectionError && attempt === maxRetries) {
              console.error("Connection failed after all retries");
              // Return null - NextAuth will show error page
              return null;
            }

            // For auth errors (401, etc.), return null (invalid credentials)
            return null;
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, trigger }) {
      console.log("🔍 JWT callback called:", {
        hasUser: !!user,
        hasAccount: !!account,
        trigger,
        currentTokenHasAccessToken: !!token.accessToken,
        currentTokenId: token.id,
      });

      // When user logs in with credentials, the user object is provided
      if (user) {
        console.log("✅ JWT callback - user provided:", {
          id: user.id,
          email: user.email,
          hasAccessToken: !!(user as any).accessToken,
          accessTokenLength: ((user as any).accessToken as string)?.length,
          userKeys: Object.keys(user),
        });

        // CRITICAL: Set accessToken from user object during initial login
        if ((user as any).accessToken) {
          token.accessToken = (user as any).accessToken;
          console.log("✅ JWT callback - SET accessToken from user object");
        } else {
          console.error("❌ CRITICAL: User object provided but NO accessToken!");
        }

        if ((user as any).role) {
          token.role = (user as any).role;
        }

        if ((user as any).tenantId) {
          token.tenantId = (user as any).tenantId;
        }

        if (user.id) {
          token.id = user.id;
        }

        console.log("✅ JWT callback - AFTER setting from user:", {
          accessTokenSet: !!token.accessToken,
          accessTokenLength: (token.accessToken as string)?.length,
        });
      } else {
        // On subsequent requests, user is not provided - preserve existing token.accessToken
        console.log("⚠️ JWT callback - NO user object, preserving existing token.accessToken:", {
          hasAccessToken: !!token.accessToken,
          accessTokenLength: (token.accessToken as string)?.length,
        });

        // If token doesn't have accessToken, something went wrong - log it
        if (!token.accessToken) {
          console.error("❌ CRITICAL: Token missing accessToken! This should not happen.");
          console.error("❌ Token will be invalid - user needs to log out and log back in.");
        }
      }

      console.log("✅ JWT callback - FINAL token:", {
        hasAccessToken: !!token.accessToken,
        accessTokenLength: (token.accessToken as string)?.length,
        userId: token.id,
        tokenKeys: Object.keys(token),
      });
      return token;
    },
    async session({ session, token }) {
      console.log("✅ Session callback - token:", {
        hasAccessToken: !!token.accessToken,
        accessTokenLength: (token.accessToken as string)?.length,
        tokenId: token.id
      });

      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
        session.user.id = (token.id || token.sub) as string;
        (session.user as any).role = token.role;
        (session.user as any).tenantId = token.tenantId;
        console.log("✅ Session callback - accessToken SET in session");
      } else {
        console.error("❌ Session callback - NO accessToken in token!");
      }

      console.log("✅ Session callback - returning session:", {
        hasAccessToken: !!session.accessToken,
        accessTokenLength: (session.accessToken as string)?.length,
        userId: session.user.id,
        userTenantId: (session.user as any).tenantId,
        userKeys: Object.keys(session.user)
      });
      return session;
    },
  },
  pages: {
    signIn: "/en/login",
    error: "/en/login", // Redirect errors to login page
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === "production" ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: false, // Allow client-side access for API client
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 24 * 60 * 60,
      },
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };