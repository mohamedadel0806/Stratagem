'use client';

import { FieldErrors } from 'react-hook-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

/**
 * Helper function to safely convert error objects to strings
 * Handles objects like {id, name, code} that can't be rendered directly
 */
export function normalizeErrorToString(error: any): string {
  if (!error) return 'Validation error';
  if (typeof error === 'string') return error;
  if (typeof error.message === 'string') return error.message;
  if (typeof error.message === 'object' && error.message !== null) {
    // Handle nested error objects
    if (error.message.message) return String(error.message.message);
    if (error.message.name) return String(error.message.name);
    if (error.message.id) return String(error.message.id);
    return JSON.stringify(error.message);
  }
  // Handle objects like {id, name, code}
  if (typeof error === 'object' && error !== null) {
    if (error.name) return String(error.name);
    if (error.id) return String(error.id);
    if (error.code) return String(error.code);
    return JSON.stringify(error);
  }
  return String(error);
}

/**
 * Helper function to extract errors from API response and normalize to string array
 */
export function extractServerErrors(error: any, fallbackMessage: string): string[] {
  const errors: string[] = [];
  
  if (error?.response?.data?.message) {
    errors.push(normalizeErrorToString(error.response.data.message));
  }
  
  // Handle validation errors from backend (can be array or object)
  if (error?.response?.data?.details?.errors) {
    const detailErrors = Array.isArray(error.response.data.details.errors) 
      ? error.response.data.details.errors 
      : [error.response.data.details.errors];
    detailErrors.forEach((err: any) => {
      errors.push(normalizeErrorToString(err));
    });
  }
  
  return errors.length > 0 ? errors : [fallbackMessage];
}

interface FormValidationSummaryProps {
  /** Form errors from react-hook-form */
  formErrors?: FieldErrors<any>;
  /** Server-side errors (array of error messages) */
  serverErrors?: string[];
  /** Optional function to map field names to display names */
  fieldNameMapper?: (fieldName: string) => string;
  /** Optional custom title */
  title?: string;
}

/**
 * Reusable component to display form validation errors and server-side errors
 * at the top of forms. Shows both client-side and server-side validation errors
 * in a clear, accessible format.
 */
export function FormValidationSummary({
  formErrors = {},
  serverErrors = [],
  fieldNameMapper,
  title = 'Please fix the following errors:',
}: FormValidationSummaryProps) {
  const hasFormErrors = Object.keys(formErrors).length > 0;
  const hasServerErrors = serverErrors.length > 0;
  const hasAnyErrors = hasFormErrors || hasServerErrors;

  if (!hasAnyErrors) {
    return null;
  }

  // Default field name mapper - converts camelCase to Title Case
  const defaultFieldNameMapper = (fieldName: string): string => {
    return fieldName
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
      .trim();
  };

  const getFieldDisplayName = fieldNameMapper || defaultFieldNameMapper;


  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="mb-2">{title}</AlertTitle>
      <AlertDescription>
        <ul className="list-disc list-inside space-y-1 text-sm">
          {/* Form validation errors */}
          {hasFormErrors &&
            Object.entries(formErrors).map(([field, error]) => (
              <li key={field}>
                <strong>{getFieldDisplayName(field)}:</strong>{' '}
                {normalizeErrorToString(error)}
              </li>
            ))}
          {/* Server-side errors */}
          {hasServerErrors &&
            serverErrors.map((error, index) => (
              <li key={`server-error-${index}`}>{normalizeErrorToString(error)}</li>
            ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}


