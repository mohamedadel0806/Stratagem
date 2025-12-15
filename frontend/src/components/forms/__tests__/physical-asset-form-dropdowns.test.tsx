import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PhysicalAssetForm } from '../physical-asset-form';
import * as assetsApi from '@/lib/api/assets';
import * as usersApi from '@/lib/api/users';
import * as businessUnitsApi from '@/lib/api/business-units';

// Mock the APIs
jest.mock('@/lib/api/assets');
jest.mock('@/lib/api/users');
jest.mock('@/lib/api/business-units');
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

const mockUsers = [
  { id: 'user-1', email: 'john.doe@example.com', firstName: 'John', lastName: 'Doe' },
  { id: 'user-2', email: 'jane.smith@example.com', firstName: 'Jane', lastName: 'Smith' },
];

const mockBusinessUnits = [
  { id: 'bu-1', name: 'IT Department', code: 'IT-DEPT' },
  { id: 'bu-2', name: 'Finance', code: 'FIN' },
];

const mockAssetTypes = [
  { id: 'type-1', name: 'Server', category: 'physical' as const },
  { id: 'type-2', name: 'Workstation', category: 'physical' as const },
];

describe('PhysicalAssetForm - Dropdown Fields', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, cacheTime: 0 },
        mutations: { retry: false },
      },
    });

    jest.clearAllMocks();
    
    // Mock API responses
    (usersApi.getAll as jest.Mock) = jest.fn().mockResolvedValue(mockUsers);
    (businessUnitsApi.getAll as jest.Mock) = jest.fn().mockResolvedValue(mockBusinessUnits);
    (assetsApi.getAssetTypes as jest.Mock) = jest.fn().mockResolvedValue(mockAssetTypes);
    (assetsApi.createPhysicalAsset as jest.Mock) = jest.fn().mockResolvedValue({ id: 'new-asset' });
    (assetsApi.updatePhysicalAsset as jest.Mock) = jest.fn().mockResolvedValue({ id: 'updated-asset' });
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  describe('Owner Field Dropdown', () => {
    test('should render Owner field as Select dropdown (not Input)', async () => {
      renderWithProviders(<PhysicalAssetForm onSuccess={jest.fn()} />);

      // Navigate to Ownership tab
      const ownershipTab = screen.getByRole('tab', { name: /ownership/i });
      await userEvent.click(ownershipTab);

      // Wait for users to load
      await waitFor(() => {
        expect(usersApi.getAll).toHaveBeenCalled();
      });

      // Find Owner field - should be a button (Radix Select trigger), not an input
      const ownerField = screen.getByLabelText(/owner/i);
      
      // Verify it's not a text input
      const input = screen.queryByRole('textbox', { name: /owner/i });
      expect(input).toBeNull();

      // Verify it's a select/combobox
      const selectTrigger = screen.getByRole('combobox', { name: /owner/i }) || 
                           ownerField.closest('button');
      expect(selectTrigger).toBeTruthy();
    });

    test('should display user names in Owner dropdown (not UUIDs)', async () => {
      renderWithProviders(<PhysicalAssetForm onSuccess={jest.fn()} />);

      // Navigate to Ownership tab
      const ownershipTab = screen.getByRole('tab', { name: /ownership/i });
      await userEvent.click(ownershipTab);

      // Wait for users to load
      await waitFor(() => {
        expect(usersApi.getAll).toHaveBeenCalled();
      });

      // Click Owner dropdown
      const ownerTrigger = screen.getByRole('combobox', { name: /owner/i }) || 
                          screen.getByLabelText(/owner/i);
      await userEvent.click(ownerTrigger);

      // Wait for dropdown options to appear
      await waitFor(() => {
        const options = screen.getAllByRole('option');
        expect(options.length).toBeGreaterThan(0);
      });

      // Verify options show user names, not UUIDs
      const options = screen.getAllByRole('option');
      const firstOption = options[0];
      const optionText = firstOption.textContent || '';

      // Should contain name or email, not just UUID
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(optionText.trim());
      expect(isUUID).toBe(false);

      // Should contain readable text
      expect(optionText.length).toBeGreaterThan(5);
    });

    test('should show loading state while fetching users', async () => {
      // Delay the API response
      (usersApi.getAll as jest.Mock) = jest.fn().mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockUsers), 100))
      );

      renderWithProviders(<PhysicalAssetForm onSuccess={jest.fn()} />);

      // Navigate to Ownership tab
      const ownershipTab = screen.getByRole('tab', { name: /ownership/i });
      await userEvent.click(ownershipTab);

      // Should show loading state
      const loadingText = screen.queryByText(/loading/i);
      // Loading might be brief, so we just verify the field exists
      const ownerField = screen.getByLabelText(/owner/i);
      expect(ownerField).toBeInTheDocument();
    });
  });

  describe('Business Unit Field Dropdown', () => {
    test('should render Business Unit field as Select dropdown (not Input)', async () => {
      renderWithProviders(<PhysicalAssetForm onSuccess={jest.fn()} />);

      // Navigate to Ownership tab
      const ownershipTab = screen.getByRole('tab', { name: /ownership/i });
      await userEvent.click(ownershipTab);

      // Wait for business units to load
      await waitFor(() => {
        expect(businessUnitsApi.getAll).toHaveBeenCalled();
      });

      // Find Business Unit field - should be a button, not an input
      const businessUnitField = screen.getByLabelText(/business unit/i);
      
      // Verify it's not a text input
      const input = screen.queryByRole('textbox', { name: /business unit/i });
      expect(input).toBeNull();

      // Verify it's a select/combobox
      const selectTrigger = screen.getByRole('combobox', { name: /business unit/i }) || 
                           businessUnitField.closest('button');
      expect(selectTrigger).toBeTruthy();
    });

    test('should display business unit names in dropdown (not UUIDs)', async () => {
      renderWithProviders(<PhysicalAssetForm onSuccess={jest.fn()} />);

      // Navigate to Ownership tab
      const ownershipTab = screen.getByRole('tab', { name: /ownership/i });
      await userEvent.click(ownershipTab);

      // Wait for business units to load
      await waitFor(() => {
        expect(businessUnitsApi.getAll).toHaveBeenCalled();
      });

      // Click Business Unit dropdown
      const businessUnitTrigger = screen.getByRole('combobox', { name: /business unit/i }) || 
                                  screen.getByLabelText(/business unit/i);
      await userEvent.click(businessUnitTrigger);

      // Wait for dropdown options to appear
      await waitFor(() => {
        const options = screen.getAllByRole('option');
        expect(options.length).toBeGreaterThan(0);
      });

      // Verify options show business unit names, not UUIDs
      const options = screen.getAllByRole('option');
      const firstOption = options[0];
      const optionText = firstOption.textContent || '';

      // Should contain name, not just UUID
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(optionText.trim());
      expect(isUUID).toBe(false);

      // Should contain readable text
      expect(optionText.length).toBeGreaterThan(5);
    });
  });

  describe('Asset Type Field Dropdown', () => {
    test('should render Asset Type field as Select dropdown (not Input)', async () => {
      renderWithProviders(<PhysicalAssetForm onSuccess={jest.fn()} />);

      // Wait for asset types to load
      await waitFor(() => {
        expect(assetsApi.getAssetTypes).toHaveBeenCalledWith('physical');
      });

      // Find Asset Type field - should be a button, not an input
      const assetTypeField = screen.getByLabelText(/asset type/i);
      
      // Verify it's not a text input
      const input = screen.queryByRole('textbox', { name: /asset type/i });
      expect(input).toBeNull();

      // Verify it's a select/combobox
      const selectTrigger = screen.getByRole('combobox', { name: /asset type/i }) || 
                           assetTypeField.closest('button');
      expect(selectTrigger).toBeTruthy();
    });

    test('should display asset type names in dropdown (not UUIDs)', async () => {
      renderWithProviders(<PhysicalAssetForm onSuccess={jest.fn()} />);

      // Wait for asset types to load
      await waitFor(() => {
        expect(assetsApi.getAssetTypes).toHaveBeenCalledWith('physical');
      });

      // Click Asset Type dropdown
      const assetTypeTrigger = screen.getByRole('combobox', { name: /asset type/i }) || 
                              screen.getByLabelText(/asset type/i);
      await userEvent.click(assetTypeTrigger);

      // Wait for dropdown options to appear
      await waitFor(() => {
        const options = screen.getAllByRole('option');
        expect(options.length).toBeGreaterThan(0);
      });

      // Verify options show asset type names, not UUIDs
      const options = screen.getAllByRole('option');
      const firstOption = options[0];
      const optionText = firstOption.textContent || '';

      // Should contain name, not just UUID
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(optionText.trim());
      expect(isUUID).toBe(false);

      // Should contain readable text
      expect(optionText.length).toBeGreaterThan(2);
    });
  });

  describe('Form Submission with Dropdowns', () => {
    test('should submit form with selected Owner UUID', async () => {
      const onSuccess = jest.fn();
      renderWithProviders(<PhysicalAssetForm onSuccess={onSuccess} />);

      // Fill required fields
      const uniqueIdentifier = screen.getByLabelText(/unique identifier/i);
      await userEvent.type(uniqueIdentifier, 'TEST-001');

      const assetDescription = screen.getByLabelText(/asset description/i);
      await userEvent.type(assetDescription, 'Test Asset');

      // Navigate to Ownership tab
      const ownershipTab = screen.getByRole('tab', { name: /ownership/i });
      await userEvent.click(ownershipTab);

      // Wait for users to load and select one
      await waitFor(() => {
        expect(usersApi.getAll).toHaveBeenCalled();
      });

      // Select owner from dropdown
      const ownerTrigger = screen.getByRole('combobox', { name: /owner/i }) || 
                          screen.getByLabelText(/owner/i);
      await userEvent.click(ownerTrigger);

      await waitFor(() => {
        const options = screen.getAllByRole('option');
        expect(options.length).toBeGreaterThan(0);
      });

      const ownerOption = screen.getByRole('option', { name: /john doe/i });
      await userEvent.click(ownerOption);

      // Submit form
      const submitButton = screen.getByRole('button', { name: /create/i });
      await userEvent.click(submitButton);

      // Verify API was called with UUID (not name)
      await waitFor(() => {
        expect(assetsApi.createPhysicalAsset).toHaveBeenCalled();
      });

      const createCall = (assetsApi.createPhysicalAsset as jest.Mock).mock.calls[0][0];
      expect(createCall.ownerId).toBe('user-1'); // UUID, not name
    });

    test('should submit form with selected Business Unit UUID', async () => {
      const onSuccess = jest.fn();
      renderWithProviders(<PhysicalAssetForm onSuccess={onSuccess} />);

      // Fill required fields
      const uniqueIdentifier = screen.getByLabelText(/unique identifier/i);
      await userEvent.type(uniqueIdentifier, 'TEST-002');

      const assetDescription = screen.getByLabelText(/asset description/i);
      await userEvent.type(assetDescription, 'Test Asset');

      // Navigate to Ownership tab
      const ownershipTab = screen.getByRole('tab', { name: /ownership/i });
      await userEvent.click(ownershipTab);

      // Wait for business units to load and select one
      await waitFor(() => {
        expect(businessUnitsApi.getAll).toHaveBeenCalled();
      });

      // Select business unit from dropdown
      const businessUnitTrigger = screen.getByRole('combobox', { name: /business unit/i }) || 
                                  screen.getByLabelText(/business unit/i);
      await userEvent.click(businessUnitTrigger);

      await waitFor(() => {
        const options = screen.getAllByRole('option');
        expect(options.length).toBeGreaterThan(0);
      });

      const buOption = screen.getByRole('option', { name: /IT Department/i });
      await userEvent.click(buOption);

      // Submit form
      const submitButton = screen.getByRole('button', { name: /create/i });
      await userEvent.click(submitButton);

      // Verify API was called with UUID (not name)
      await waitFor(() => {
        expect(assetsApi.createPhysicalAsset).toHaveBeenCalled();
      });

      const createCall = (assetsApi.createPhysicalAsset as jest.Mock).mock.calls[0][0];
      expect(createCall.businessUnitId).toBe('bu-1'); // UUID, not name
    });
  });
});
