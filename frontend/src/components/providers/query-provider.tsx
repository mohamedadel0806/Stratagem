"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useState } from "react"

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 2 * 60 * 1000, // 2 minutes - increased to reduce refetch frequency
            refetchOnWindowFocus: false,
            retry: (failureCount, error: any) => {
              // Don't retry on 429 (rate limit) errors - let them fail gracefully
              if (error?.response?.status === 429) {
                return false;
              }
              // Retry other errors up to 2 times
              return failureCount < 2;
            },
            retryDelay: (attemptIndex, error: any) => {
              // For 429 errors, use exponential backoff with longer delays
              if (error?.response?.status === 429) {
                // Start with 5 seconds, exponentially increase
                return Math.min(1000 * 5 * Math.pow(2, attemptIndex), 30000); // Max 30 seconds
              }
              // For other errors, use standard exponential backoff
              return Math.min(1000 * Math.pow(2, attemptIndex), 30000);
            },
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

