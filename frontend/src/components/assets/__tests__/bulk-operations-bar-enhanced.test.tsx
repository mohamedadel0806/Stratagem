import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BulkOperationsBar } from '@/components/assets/bulk-operations-bar-enhanced';
import { assetsApi } from '@/lib/api/assets';

jest.mock('@/lib/api/assets', () => ({
  assetsApi: {
    bulkUpdate: jest.fn(),
  },
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

const renderWithClient = (ui: React.ReactElement) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
};

describe('BulkOperationsBarEnhanced', () => {
  const onClearSelection = jest.fn();
  const onUpdate = jest.fn();

  const selectedItems = [
    { id: 'asset-1', assetDescription: 'Asset 1' },
    { id: 'asset-2', assetDescription: 'Asset 2' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sends rollbackOnError=true in bulkUpdate payload', async () => {
    (assetsApi.bulkUpdate as jest.Mock).mockResolvedValue({
      successful: 2,
      failed: 0,
      errors: [],
      rolledBack: false,
    });

    renderWithClient(
      <BulkOperationsBar
        selectedCount={selectedItems.length}
        selectedItems={selectedItems}
        onClearSelection={onClearSelection}
        onDelete={jest.fn()}
        onUpdate={onUpdate}
        assetType="physical"
      />,
    );

    // Open update dialog
    fireEvent.click(screen.getByText(/Update/i));

    // Trigger update
    fireEvent.click(screen.getByRole('button', { name: /Update$/i }));

    await waitFor(() => {
      expect(assetsApi.bulkUpdate).toHaveBeenCalledTimes(1);
    });

    const [, payload] = (assetsApi.bulkUpdate as jest.Mock).mock.calls[0];
    expect(payload.assetIds).toEqual(['asset-1', 'asset-2']);
    expect(payload.rollbackOnError).toBe(true);
  });

  it('handles rolledBack=true without throwing', async () => {
    (assetsApi.bulkUpdate as jest.Mock).mockResolvedValue({
      successful: 0,
      failed: 2,
      errors: [
        { assetId: 'asset-1', error: 'Update failed' },
        { assetId: 'asset-2', error: 'Update failed' },
      ],
      rolledBack: true,
    });

    renderWithClient(
      <BulkOperationsBar
        selectedCount={selectedItems.length}
        selectedItems={selectedItems}
        onClearSelection={onClearSelection}
        onDelete={jest.fn()}
        onUpdate={onUpdate}
        assetType="physical"
      />,
    );

    fireEvent.click(screen.getByText(/Update/i));
    fireEvent.click(screen.getByRole('button', { name: /Update$/i }));

    await waitFor(() => {
      expect(assetsApi.bulkUpdate).toHaveBeenCalledTimes(1);
    });

    // Dialog should show the summary of results
    expect(screen.getByText(/2 failed/i)).toBeInTheDocument();
  });
});

