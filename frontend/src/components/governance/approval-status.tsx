'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/helpers';

export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

interface ApprovalStatusProps {
  status: ApprovalStatus | string;
  className?: string;
}

export function ApprovalStatusBadge({ status, className }: ApprovalStatusProps) {
  const statusConfig = {
    pending: {
      label: 'Pending',
      variant: 'secondary' as const,
      className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    },
    approved: {
      label: 'Approved',
      variant: 'default' as const,
      className: 'bg-green-100 text-green-800 border-green-300',
    },
    rejected: {
      label: 'Rejected',
      variant: 'destructive' as const,
      className: 'bg-red-100 text-red-800 border-red-300',
    },
    cancelled: {
      label: 'Cancelled',
      variant: 'secondary' as const,
      className: 'bg-gray-100 text-gray-800 border-gray-300',
    },
  };

  const config = statusConfig[status.toLowerCase() as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <Badge
      variant={config.variant}
      className={cn('font-medium', config.className, className)}
    >
      {config.label}
    </Badge>
  );
}





