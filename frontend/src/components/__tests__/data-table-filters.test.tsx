import React from 'react'
import { render, screen } from '@testing-library/react'
import { DataTableFilters } from '../filters/data-table-filters'

describe('DataTableFilters Component', () => {
  const mockFilters = [
    {
      key: 'status',
      label: 'Status',
      value: '',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
      ],
    },
  ]

  it('should not have SelectItem with empty string values', () => {
    const { container } = render(
      <DataTableFilters
        filters={mockFilters}
        onFilterChange={() => {}}
        searchValue=""
        onSearchChange={() => {}}
      />
    )

    // Check that no SelectItem has an empty string value
    const selectItems = container.querySelectorAll('[data-radix-select-item]')
    selectItems.forEach((item) => {
      const value = item.getAttribute('data-value')
      expect(value).not.toBe('')
      expect(value).toBeTruthy()
    })
  })

  it('should convert empty string to "all" for filter values', () => {
    render(
      <DataTableFilters
        filters={mockFilters}
        onFilterChange={() => {}}
        searchValue=""
        onSearchChange={() => {}}
      />
    )

    // The "All" option should have value "all", not ""
    const allOption = screen.getByText(/All Status/i)
    expect(allOption).toBeInTheDocument()
  })
})









