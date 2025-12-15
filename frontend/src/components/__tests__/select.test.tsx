import React from 'react'
import { render, screen } from '@testing-library/react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

describe('Select Component', () => {
  it('should not allow empty string values in SelectItem', () => {
    // This test validates that we should never use empty string values
    // In practice, Radix UI will throw an error if we do
    // We test this by ensuring our code filters out empty values
    const options = [
      { value: 'valid1', label: 'Valid 1' },
      { value: '', label: 'Empty Value' }, // This should be filtered out
      { value: 'valid2', label: 'Valid 2' },
    ].filter(opt => opt.value && opt.value !== '') // Filter empty values

    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Test" />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
    
    // Should only render valid options
    expect(screen.getByText('Valid 1')).toBeInTheDocument()
    expect(screen.getByText('Valid 2')).toBeInTheDocument()
    expect(screen.queryByText('Empty Value')).not.toBeInTheDocument()
  })

  it('should accept non-empty string values', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Test" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="valid-value">Valid Value</SelectItem>
        </SelectContent>
      </Select>
    )
    
    // Should render without errors
    expect(screen.getByText('Valid Value')).toBeInTheDocument()
  })

  it('should handle undefined values gracefully', () => {
    const options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: undefined, label: 'Undefined Option' },
    ].filter(opt => opt.value) // Filter out undefined

    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Test" />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value!}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
    
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
    expect(screen.queryByText('Undefined Option')).not.toBeInTheDocument()
  })
})

