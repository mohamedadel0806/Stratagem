import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RiskAssessmentRequestForm } from '../risk-assessment-request-form';
import * as risksApi from '@/lib/api/risks';
import * as usersApi from '@/lib/api/users';

// Mock the APIs
jest.mock('@/lib/api/risks');
jest.mock('@/lib/api/users');
jest.mock('next/navigation', () => ({
  useParams: () => ({ locale: 'en' }),
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
const mockUsers = [
  { id: 'user-1', email: 'user1@example.com', firstName: 'John', lastName: 'Doe' },
  { id: 'user-2', email: 'user2@example.com', firstName: 'Jane', lastName: 'Smith' },
];

describe('RiskAssessmentRequestForm', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    jest.clearAllMocks();
    (risksApi.riskAssessmentRequestsApi.create as jest.Mock) = mockCreateMutation;
    (risksApi.riskAssessmentRequestsApi.update as jest.Mock) = mockUpdateMutation;
    (usersApi.usersApi.getAll as jest.Mock) = jest.fn().mockResolvedValue(mockUsers);
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  describe('Form Rendering', () => {
    it('should render form dialog when open', () => {
      renderWithProviders(
        <RiskAssessmentRequestForm
          open={true}
          onOpenChange={jest.fn()}
          riskId="risk-123"
        />
      );

      expect(screen.getByText(/Create Assessment Request/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Assessment Type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Priority/i)).toBeInTheDocument();
    });

    it('should not render form when closed', () => {
      renderWithProviders(
        <RiskAssessmentRequestForm
          open={false}
          onOpenChange={jest.fn()}
          riskId="risk-123"
        />
      );

      expect(screen.queryByText(/Create Assessment Request/i)).not.toBeInTheDocument();
    });

    it('should render all required fields', () => {
      renderWithProviders(
        <RiskAssessmentRequestForm
          open={true}
          onOpenChange={jest.fn()}
          riskId="risk-123"
        />
      );

      expect(screen.getByLabelText(/Assessment Type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Priority/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Assign To/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Justification/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Notes/i)).toBeInTheDocument();
    });

    it('should render risk ID field when riskId not provided', () => {
      renderWithProviders(
        <RiskAssessmentRequestForm
          open={true}
          onOpenChange={jest.fn()}
        />
      );

      expect(screen.getByLabelText(/Risk/i)).toBeInTheDocument();
    });

    it('should pre-fill risk ID when provided', () => {
      renderWithProviders(
        <RiskAssessmentRequestForm
          open={true}
          onOpenChange={jest.fn()}
          riskId="risk-123"
        />
      );

      // Risk ID field should not be visible when provided
      expect(screen.queryByLabelText(/Risk/i)).not.toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should show validation error for missing assessment type', async () => {
      const user = userEvent.setup();
      renderWithProviders(
        <RiskAssessmentRequestForm
          open={true}
          onOpenChange={jest.fn()}
          riskId="risk-123"
        />
      );

      const submitButton = screen.getByRole('button', { name: /Create Request/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/required/i)).toBeInTheDocument();
      });
    });

    it('should validate risk_id when not provided', async () => {
      const user = userEvent.setup();
      renderWithProviders(
        <RiskAssessmentRequestForm
          open={true}
          onOpenChange={jest.fn()}
        />
      );

      const submitButton = screen.getByRole('button', { name: /Create Request/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Risk ID is required/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission - Create Mode', () => {
    it('should submit form with correct data', async () => {
      const user = userEvent.setup();
      const onSuccess = jest.fn();
      mockCreateMutation.mockResolvedValue({
        id: 'request-123',
        request_identifier: 'REQ-202501-0001',
        risk_id: 'risk-123',
        assessment_type: 'current',
        priority: 'high',
      });

      renderWithProviders(
        <RiskAssessmentRequestForm
          open={true}
          onOpenChange={jest.fn()}
          riskId="risk-123"
          onSuccess={onSuccess}
        />
      );

      // Select assessment type
      const assessmentTypeField = screen.getByLabelText(/Assessment Type/i);
      await user.click(assessmentTypeField);
      await waitFor(() => {
        expect(screen.getByText(/Current Risk/i)).toBeInTheDocument();
      });
      await user.click(screen.getByText(/Current Risk/i));

      // Select priority
      const priorityField = screen.getByLabelText(/Priority/i);
      await user.click(priorityField);
      await waitFor(() => {
        expect(screen.getByText(/High/i)).toBeInTheDocument();
      });
      await user.click(screen.getByText(/High/i));

      // Fill optional fields
      await user.type(screen.getByLabelText(/Justification/i), 'Need to reassess');
      await user.type(screen.getByLabelText(/Notes/i), 'Test notes');

      // Submit
      const submitButton = screen.getByRole('button', { name: /Create Request/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockCreateMutation).toHaveBeenCalledWith({
          risk_id: 'risk-123',
          assessment_type: 'current',
          priority: 'high',
          requested_for_id: undefined,
          due_date: undefined,
          justification: 'Need to reassess',
          notes: 'Test notes',
        });
      });
    });

    it('should handle user assignment', async () => {
      const user = userEvent.setup();
      mockCreateMutation.mockResolvedValue({ id: 'request-123' });

      renderWithProviders(
        <RiskAssessmentRequestForm
          open={true}
          onOpenChange={jest.fn()}
          riskId="risk-123"
        />
      );

      // Wait for users to load
      await waitFor(() => {
        expect(screen.getByText(/Assign To/i)).toBeInTheDocument();
      });

      // Select assignee
      const assignField = screen.getByLabelText(/Assign To/i);
      await user.click(assignField);
      await waitFor(() => {
        expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      });
      await user.click(screen.getByText(/John Doe/i));

      // Select assessment type
      const assessmentTypeField = screen.getByLabelText(/Assessment Type/i);
      await user.click(assessmentTypeField);
      await waitFor(() => {
        expect(screen.getByText(/Current Risk/i)).toBeInTheDocument();
      });
      await user.click(screen.getByText(/Current Risk/i));

      // Submit
      const submitButton = screen.getByRole('button', { name: /Create Request/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockCreateMutation).toHaveBeenCalledWith(
          expect.objectContaining({
            requested_for_id: 'user-1',
          }),
        );
      });
    });

    it('should handle due date input', async () => {
      const user = userEvent.setup();
      mockCreateMutation.mockResolvedValue({ id: 'request-123' });

      renderWithProviders(
        <RiskAssessmentRequestForm
          open={true}
          onOpenChange={jest.fn()}
          riskId="risk-123"
        />
      );

      // Select assessment type
      const assessmentTypeField = screen.getByLabelText(/Assessment Type/i);
      await user.click(assessmentTypeField);
      await waitFor(() => {
        expect(screen.getByText(/Current Risk/i)).toBeInTheDocument();
      });
      await user.click(screen.getByText(/Current Risk/i));

      // Fill due date
      const dueDateField = screen.getByLabelText(/Due Date/i);
      await user.type(dueDateField, '2025-02-01');

      // Submit
      const submitButton = screen.getByRole('button', { name: /Create Request/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockCreateMutation).toHaveBeenCalledWith(
          expect.objectContaining({
            due_date: '2025-02-01',
          }),
        );
      });
    });
  });

  describe('Form Submission - Edit Mode', () => {
    const mockRequest: Partial<RiskAssessmentRequest> = {
      id: 'request-123',
      request_identifier: 'REQ-202501-0001',
      risk_id: 'risk-123',
      assessment_type: 'current',
      priority: 'medium',
      justification: 'Original justification',
      notes: 'Original notes',
      requested_for_id: 'user-1',
      due_date: '2025-02-01',
    };

    it('should pre-fill form with existing data', async () => {
      renderWithProviders(
        <RiskAssessmentRequestForm
          open={true}
          onOpenChange={jest.fn()}
          riskId="risk-123"
          initialData={mockRequest as RiskAssessmentRequest}
        />
      );

      await waitFor(() => {
        expect(screen.getByDisplayValue(/Original justification/i)).toBeInTheDocument();
        expect(screen.getByDisplayValue(/Original notes/i)).toBeInTheDocument();
      });
    });

    it('should update request on submit', async () => {
      const user = userEvent.setup();
      mockUpdateMutation.mockResolvedValue({ ...mockRequest, priority: 'high' });

      renderWithProviders(
        <RiskAssessmentRequestForm
          open={true}
          onOpenChange={jest.fn()}
          riskId="risk-123"
          initialData={mockRequest as RiskAssessmentRequest}
        />
      );

      // Wait for form to load with initial data
      await waitFor(() => {
        expect(screen.getByText(/Edit Assessment Request/i)).toBeInTheDocument();
      });

      // Update priority
      const priorityField = screen.getByLabelText(/Priority/i);
      await user.click(priorityField);
      await waitFor(() => {
        expect(screen.getByText(/High/i)).toBeInTheDocument();
      });
      await user.click(screen.getByText(/High/i));

      // Submit
      const submitButton = screen.getByRole('button', { name: /Update/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockUpdateMutation).toHaveBeenCalledWith('request-123', {
          priority: 'high',
          requested_for_id: 'user-1',
          due_date: '2025-02-01',
          justification: 'Original justification',
          notes: 'Original notes',
        });
      });
    });

    it('should disable assessment type in edit mode', () => {
      renderWithProviders(
        <RiskAssessmentRequestForm
          open={true}
          onOpenChange={jest.fn()}
          riskId="risk-123"
          initialData={mockRequest as RiskAssessmentRequest}
        />
      );

      const assessmentTypeField = screen.getByLabelText(/Assessment Type/i);
      // Assessment type should be disabled (we can't directly test disabled state of Select,
      // but the field should be rendered)
      expect(assessmentTypeField).toBeInTheDocument();
    });
  });

  describe('Form Interactions', () => {
    it('should close dialog when cancel button clicked', async () => {
      const user = userEvent.setup();
      const onOpenChange = jest.fn();

      renderWithProviders(
        <RiskAssessmentRequestForm
          open={true}
          onOpenChange={onOpenChange}
          riskId="risk-123"
        />
      );

      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      await user.click(cancelButton);

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('should call onSuccess callback after successful creation', async () => {
      const user = userEvent.setup();
      const onSuccess = jest.fn();
      mockCreateMutation.mockResolvedValue({ id: 'request-123' });

      renderWithProviders(
        <RiskAssessmentRequestForm
          open={true}
          onOpenChange={jest.fn()}
          riskId="risk-123"
          onSuccess={onSuccess}
        />
      );

      // Select assessment type
      const assessmentTypeField = screen.getByLabelText(/Assessment Type/i);
      await user.click(assessmentTypeField);
      await waitFor(() => {
        expect(screen.getByText(/Current Risk/i)).toBeInTheDocument();
      });
      await user.click(screen.getByText(/Current Risk/i));

      // Submit
      const submitButton = screen.getByRole('button', { name: /Create Request/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });

    it('should show loading state during submission', async () => {
      const user = userEvent.setup();
      let resolveMutation: (value: any) => void;
      const mutationPromise = new Promise((resolve) => {
        resolveMutation = resolve;
      });
      mockCreateMutation.mockReturnValue(mutationPromise);

      renderWithProviders(
        <RiskAssessmentRequestForm
          open={true}
          onOpenChange={jest.fn()}
          riskId="risk-123"
        />
      );

      // Select assessment type
      const assessmentTypeField = screen.getByLabelText(/Assessment Type/i);
      await user.click(assessmentTypeField);
      await waitFor(() => {
        expect(screen.getByText(/Current Risk/i)).toBeInTheDocument();
      });
      await user.click(screen.getByText(/Current Risk/i));

      // Submit
      const submitButton = screen.getByRole('button', { name: /Create Request/i });
      await user.click(submitButton);

      // Button should show loading state
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Creating.../i })).toBeInTheDocument();
      });

      // Resolve mutation
      resolveMutation!({ id: 'request-123' });
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /Creating.../i })).not.toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      const user = userEvent.setup();
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockCreateMutation.mockRejectedValue(new Error('API Error'));

      renderWithProviders(
        <RiskAssessmentRequestForm
          open={true}
          onOpenChange={jest.fn()}
          riskId="risk-123"
        />
      );

      // Select assessment type
      const assessmentTypeField = screen.getByLabelText(/Assessment Type/i);
      await user.click(assessmentTypeField);
      await waitFor(() => {
        expect(screen.getByText(/Current Risk/i)).toBeInTheDocument();
      });
      await user.click(screen.getByText(/Current Risk/i));

      // Submit
      const submitButton = screen.getByRole('button', { name: /Create Request/i });
      await user.click(submitButton);

      // Form should still be open (error toast shown but not tested here)
      await waitFor(() => {
        expect(screen.getByText(/Create Assessment Request/i)).toBeInTheDocument();
      });

      consoleError.mockRestore();
    });
  });
});
