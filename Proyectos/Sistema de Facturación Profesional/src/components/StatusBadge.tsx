import React from 'react';
import { Badge } from './ui/badge';
import type { InvoiceStatus, ProjectStatus, ClientStatus, Priority } from '../types';
import { 
  INVOICE_STATUS_LABELS, 
  PROJECT_STATUS_LABELS, 
  PRIORITY_LABELS,
  CLIENT_STATUS_LABELS 
} from '../lib/constants';

type StatusType = InvoiceStatus | ProjectStatus | ClientStatus | Priority;

interface StatusBadgeProps {
  status: StatusType;
  type: 'invoice' | 'project' | 'client' | 'priority';
}

const STATUS_STYLES: Record<string, Record<string, { className: string; label: string }>> = {
  invoice: {
    draft: { className: 'bg-gray-100 text-gray-800', label: INVOICE_STATUS_LABELS.draft },
    sent: { className: 'bg-blue-100 text-blue-800', label: INVOICE_STATUS_LABELS.sent },
    paid: { className: 'bg-green-100 text-green-800', label: INVOICE_STATUS_LABELS.paid },
    pending: { className: 'bg-yellow-100 text-yellow-800', label: INVOICE_STATUS_LABELS.pending },
    overdue: { className: 'bg-red-100 text-red-800', label: INVOICE_STATUS_LABELS.overdue },
    cancelled: { className: 'bg-gray-100 text-gray-800', label: INVOICE_STATUS_LABELS.cancelled },
  },
  project: {
    planning: { className: 'bg-blue-100 text-blue-800', label: PROJECT_STATUS_LABELS.planning },
    in_progress: { className: 'bg-green-100 text-green-800', label: PROJECT_STATUS_LABELS.in_progress },
    active: { className: 'bg-green-100 text-green-800', label: 'Activo' },
    on_hold: { className: 'bg-yellow-100 text-yellow-800', label: PROJECT_STATUS_LABELS.on_hold },
    completed: { className: 'bg-purple-100 text-purple-800', label: PROJECT_STATUS_LABELS.completed },
  },
  client: {
    active: { className: 'bg-green-100 text-green-800', label: CLIENT_STATUS_LABELS.active },
    inactive: { className: 'bg-gray-100 text-gray-800', label: CLIENT_STATUS_LABELS.inactive },
  },
  priority: {
    high: { className: 'bg-red-100 text-red-800', label: PRIORITY_LABELS.high },
    medium: { className: 'bg-yellow-100 text-yellow-800', label: PRIORITY_LABELS.medium },
    low: { className: 'bg-green-100 text-green-800', label: PRIORITY_LABELS.low },
  },
};

export function StatusBadge({ status, type }: StatusBadgeProps) {
  const config = STATUS_STYLES[type]?.[status] || { 
    className: 'bg-gray-100 text-gray-800', 
    label: 'Desconocido' 
  };

  return <Badge className={config.className}>{config.label}</Badge>;
}


