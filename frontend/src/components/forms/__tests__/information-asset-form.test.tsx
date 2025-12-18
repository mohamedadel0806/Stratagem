import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InformationAssetForm } from '../information-asset-form';
import * as assetsApi from '@/lib/api/assets';

// Mock the API
jest.mock('@/lib/api/assets');
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock toast
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

const mockCreateMutation = jest.fn();
const mockUpdateMutation = jest.fn();

describe('InformationAssetForm', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    jest.clearAllMocks();
    (assetsApi.createInformationAsset as jest.Mock) = mockCreateMutation;
    (assetsApi.updateInformationAsset as jest.Mock) = mockUpdateMutation;
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  describe('Form Rendering', () => {
    it('should render all required fields', () => {
      renderWithProviders(<InformationAssetForm onSuccess={jest.fn()} />);

      expect(screen.getByLabelText(/Asset Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Information Type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Data Classification/i)).toBeInTheDocument();
    });

    it('should render informationType field', () => {
      renderWithProviders(<InformationAssetForm onSuccess={jest.fn()} />);

      const informationTypeField = screen.getByLabelText(/Information Type/i);
      expect(informationTypeField).toBeInTheDocument();
      expect(informationTypeField).toHaveAttribute('required');
    });

    it('should display tabs for different sections', () => {
      renderWithProviders(<InformationAssetForm onSuccess={jest.fn()} />);

      expect(screen.getByText('Basic')).toBeInTheDocument();
      expect(screen.getByText('Classification')).toBeInTheDocument();
      expect(screen.getByText('Ownership')).toBeInTheDocument();
      expect(screen.getByText('Storage')).toBeInTheDocument();
      expect(screen.getByText('Compliance')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should show validation error for missing required fields', async () => {
      const user = userEvent.setup();
      renderWithProviders(<InformationAssetForm onSuccess={jest.fn()} />);

      const submitButton = screen.getByRole('button', { name: /Create|Save/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Asset Name is required/i)).toBeInTheDocument();
      });
    });

    it('should validate informationType is required', async () => {
      const user = userEvent.setup();
      renderWithProviders(<InformationAssetForm onSuccess={jest.fn()} />);

      // Fill only assetName, leave informationType empty
      await user.type(screen.getByLabelText(/Asset Name/i), 'Test Asset');
      
      const submitButton = screen.getByRole('button', { name: /Create|Save/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Information type is required/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should submit form with correct data transformation', async () => {
      const user = userEvent.setup();
      const onSuccess = jest.fn();
      mockCreateMutation.mockResolvedValue({ id: 'asset-123' });

      renderWithProviders(<InformationAssetForm onSuccess={onSuccess} />);

      // Fill required fields
      await user.type(screen.getByLabelText(/Asset Name/i), 'Customer Database');
      await user.type(screen.getByLabelText(/Information Type/i), 'Customer Records');
      
      // Select data classification
      const classificationField = screen.getByLabelText(/Data Classification/i);
      await user.click(classificationField);
      await user.type(classificationField, 'confidential');

      const submitButton = screen.getByRole('button', { name: /Create/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockCreateMutation).toHaveBeenCalled();
      });

      // Verify the transformation includes informationType
      const callArgs = mockCreateMutation.mock.calls[0][0];
      expect(callArgs.assetName).toBe('Customer Database');
      expect(callArgs.informationType).toBe('Customer Records');
    });

    it('should handle update mode correctly', async () => {
      const user = userEvent.setup();
      const asset = {
        id: 'asset-123',
        name: 'Existing Asset',
        informationType: 'Financial Data',
        classificationLevel: 'confidential',
      };

      mockUpdateMutation.mockResolvedValue(asset);

      renderWithProviders(<InformationAssetForm asset={asset as any} onSuccess={jest.fn()} />);

      // Verify form is pre-filled
      expect(screen.getByDisplayValue('Existing Asset')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Financial Data')).toBeInTheDocument();

      // Update informationType
      const informationTypeField = screen.getByLabelText(/Information Type/i);
      await user.clear(informationTypeField);
      await user.type(informationTypeField, 'Updated Type');

      const submitButton = screen.getByRole('button', { name: /Save/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockUpdateMutation).toHaveBeenCalled();
      });
    });
  });

  describe('Field Mappings', () => {
    it('should map frontend fields to backend DTO correctly', async () => {
      const user = userEvent.setup();
      mockCreateMutation.mockResolvedValue({ id: 'asset-123' });

      renderWithProviders(<InformationAssetForm onSuccess={jest.fn()} />);

      // Fill form with data that needs transformation
      await user.type(screen.getByLabelText(/Asset Name/i), 'Test Asset');
      await user.type(screen.getByLabelText(/Information Type/i), 'Test Type');
      
      // This would be filled via dropdown/select in real UI
      const classificationField = screen.getByLabelText(/Data Classification/i);
      await user.type(classificationField, 'confidential');

      const submitButton = screen.getByRole('button', { name: /Create/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockCreateMutation).toHaveBeenCalled();
      });

      // Verify transformation function was called with correct data
      const callArgs = mockCreateMutation.mock.calls[0][0];
      expect(callArgs).toHaveProperty('assetName');
      expect(callArgs).toHaveProperty('informationType');
      expect(callArgs).toHaveProperty('dataClassification');
    });
  });
});





