'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { GripVertical, Eye, EyeOff, Settings2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export type WidgetKey =
  | 'summary-cards'
  | 'compliance-status'
  | 'findings-severity'
  | 'control-matrix'
  | 'risk-heatmap'
  | 'timeline-widget'
  | 'trend-chart'
  | 'remediation-metrics'
  | 'remediation-gantt'
  | 'asset-compliance';

export interface WidgetConfig {
  key: WidgetKey;
  label: string;
  description: string;
  visible: boolean;
  order: number;
}

const defaultWidgets: WidgetConfig[] = [
  { key: 'summary-cards', label: 'Summary Cards', description: 'Key metrics overview', visible: true, order: 0 },
  { key: 'compliance-status', label: 'Compliance Status', description: 'Framework compliance matrix', visible: true, order: 1 },
  { key: 'findings-severity', label: 'Findings Severity', description: 'Findings distribution by severity', visible: true, order: 2 },
  { key: 'control-matrix', label: 'Control Matrix', description: 'Control implementation status', visible: true, order: 3 },
  { key: 'risk-heatmap', label: 'Risk Heatmap', description: 'Risk likelihood vs impact', visible: true, order: 4 },
  { key: 'timeline-widget', label: 'Timeline Widget', description: 'Upcoming reviews and deadlines', visible: true, order: 5 },
  { key: 'trend-chart', label: 'Trend Chart', description: 'Compliance trends over time', visible: true, order: 6 },
  { key: 'remediation-metrics', label: 'Remediation Metrics', description: 'Remediation tracking metrics', visible: true, order: 7 },
  { key: 'remediation-gantt', label: 'Remediation Gantt', description: 'Remediation timeline visualization', visible: true, order: 8 },
  { key: 'asset-compliance', label: 'Asset Compliance', description: 'Asset compliance status', visible: true, order: 9 },
];

interface GovernanceDashboardCustomizerProps {
  widgets: WidgetConfig[];
  onWidgetsChange: (widgets: WidgetConfig[]) => void;
}

function SortableWidgetItem({ widget, onToggleVisibility }: { widget: WidgetConfig; onToggleVisibility: (key: WidgetKey) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card ref={setNodeRef} style={style}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing touch-none"
            >
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                {widget.visible ? (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                )}
                <Label className="font-medium cursor-pointer" htmlFor={`widget-${widget.key}`}>
                  {widget.label}
                </Label>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{widget.description}</p>
            </div>

            <Switch
              id={`widget-${widget.key}`}
              checked={widget.visible}
              onCheckedChange={() => onToggleVisibility(widget.key)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function GovernanceDashboardCustomizer({ widgets, onWidgetsChange }: GovernanceDashboardCustomizerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localWidgets, setLocalWidgets] = useState<WidgetConfig[]>(widgets);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleToggleVisibility = (key: WidgetKey) => {
    const updated = localWidgets.map((w) =>
      w.key === key ? { ...w, visible: !w.visible } : w
    );
    setLocalWidgets(updated);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = localWidgets.findIndex((w) => w.key === active.id);
      const newIndex = localWidgets.findIndex((w) => w.key === over.id);

      const updated = arrayMove(localWidgets, oldIndex, newIndex);
      updated.forEach((w, i) => {
        w.order = i;
      });
      setLocalWidgets(updated);
    }
  };

  const handleReset = () => {
    setLocalWidgets(defaultWidgets);
  };

  const handleSave = () => {
    onWidgetsChange(localWidgets);
    // Persist to localStorage
    localStorage.setItem('governance-dashboard-widgets', JSON.stringify(localWidgets));
    setIsOpen(false);
  };

  const handleCancel = () => {
    setLocalWidgets(widgets);
    setIsOpen(false);
  };

  const sortedWidgets = [...localWidgets].sort((a, b) => a.order - b.order);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings2 className="h-4 w-4 mr-2" />
          Customize Dashboard
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customize Dashboard</DialogTitle>
          <DialogDescription>
            Show or hide widgets and reorder them to customize your dashboard view
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset to Default
            </Button>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortedWidgets.map((w) => w.key)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {sortedWidgets.map((widget) => (
                  <SortableWidgetItem
                    key={widget.key}
                    widget={widget}
                    onToggleVisibility={handleToggleVisibility}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function useDashboardWidgets(): [WidgetConfig[], (widgets: WidgetConfig[]) => void] {
  const [widgets, setWidgets] = useState<WidgetConfig[]>(() => {
    if (typeof window === 'undefined') return defaultWidgets;
    const saved = localStorage.getItem('governance-dashboard-widgets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultWidgets;
      }
    }
    return defaultWidgets;
  });

  const updateWidgets = (newWidgets: WidgetConfig[]) => {
    setWidgets(newWidgets);
    if (typeof window !== 'undefined') {
      localStorage.setItem('governance-dashboard-widgets', JSON.stringify(newWidgets));
    }
  };

  return [widgets, updateWidgets];
}
