import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GlobalSearchBar } from '@/components/assets/global-search-bar';
import { assetsApi } from '@/lib/api/assets';

jest.mock('@/lib/api/assets', () => ({
  assetsApi: {
    searchAssets: jest.fn(),
  },
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => '/dashboard',
}));

const renderWithClient = (ui: React.ReactElement) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
};

describe('GlobalSearchBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage
    Storage.prototype.getItem = jest.fn(() => null);
    Storage.prototype.setItem = jest.fn();
  });

  it('renders search input', () => {
    renderWithClient(<GlobalSearchBar />);
    expect(screen.getByPlaceholderText(/search all assets/i)).toBeInTheDocument();
  });

  it('shows suggestions when typing', async () => {
    (assetsApi.searchAssets as jest.Mock).mockResolvedValue({
      data: [
        {
          id: '1',
          type: 'physical',
          name: 'Test Asset',
          identifier: 'PA-001',
          criticality: 'high',
        },
      ],
    });

    renderWithClient(<GlobalSearchBar />);
    const input = screen.getByPlaceholderText(/search all assets/i);
    
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.focus(input);

    await waitFor(() => {
      expect(assetsApi.searchAssets).toHaveBeenCalled();
    });
  });

  it('handles Enter key to search', () => {
    const mockPush = jest.fn();
    jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue({
      push: mockPush,
    });

    renderWithClient(<GlobalSearchBar />);
    const input = screen.getByPlaceholderText(/search all assets/i);
    
    fireEvent.change(input, { target: { value: 'test query' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('/dashboard/assets/all?q=test+query')
    );
  });
});


