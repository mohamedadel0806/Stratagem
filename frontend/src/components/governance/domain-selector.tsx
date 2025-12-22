'use client';

import { useQuery } from '@tanstack/react-query';
import { governanceApi, ControlDomain } from '@/lib/api/governance';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DomainSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  includeInactive?: boolean;
}

function flattenDomains(domains: ControlDomain[], level = 0): Array<ControlDomain & { displayName: string }> {
  const result: Array<ControlDomain & { displayName: string }> = [];
  
  for (const domain of domains) {
    const indent = '  '.repeat(level);
    result.push({
      ...domain,
      displayName: `${indent}${domain.name}${domain.code ? ` (${domain.code})` : ''}`,
    });
    
    if (domain.children && domain.children.length > 0) {
      result.push(...flattenDomains(domain.children, level + 1));
    }
  }
  
  return result;
}

export function DomainSelector({
  value,
  onValueChange,
  placeholder = 'Select domain...',
  includeInactive = false,
}: DomainSelectorProps) {
  const { data: hierarchy = [], isLoading } = useQuery({
    queryKey: ['domain-hierarchy', includeInactive],
    queryFn: () => governanceApi.getDomainHierarchy(),
  });

  if (isLoading) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Loading domains..." />
        </SelectTrigger>
      </Select>
    );
  }

  const flatDomains = flattenDomains(hierarchy);

  return (
    <Select value={value || ''} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">None</SelectItem>
        {flatDomains.map((domain) => (
          <SelectItem key={domain.id} value={domain.id} disabled={!domain.is_active && !includeInactive}>
            {domain.displayName}
            {!domain.is_active && ' (Inactive)'}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}


