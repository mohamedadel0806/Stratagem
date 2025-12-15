'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Save, 
  FolderOpen, 
  Trash2, 
  ChevronDown, 
  Star,
  StarOff,
  Clock,
} from 'lucide-react';

export interface FilterPreset {
  id: string;
  name: string;
  filters: Record<string, string>;
  searchValue?: string;
  createdAt: string;
  isFavorite?: boolean;
}

interface SavedFiltersProps {
  storageKey: string; // Unique key for localStorage (e.g., 'physical-assets-filters')
  currentFilters: Record<string, string>;
  currentSearchValue?: string;
  onLoadPreset: (filters: Record<string, string>, searchValue?: string) => void;
}

export function SavedFilters({
  storageKey,
  currentFilters,
  currentSearchValue,
  onLoadPreset,
}: SavedFiltersProps) {
  const { toast } = useToast();
  const [presets, setPresets] = useState<FilterPreset[]>([]);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [presetName, setPresetName] = useState('');

  // Load presets from localStorage
  useEffect(() => {
    const savedPresets = localStorage.getItem(`saved-filters-${storageKey}`);
    if (savedPresets) {
      try {
        setPresets(JSON.parse(savedPresets));
      } catch (e) {
        console.error('Failed to parse saved filters:', e);
      }
    }
  }, [storageKey]);

  // Save presets to localStorage
  const savePresets = useCallback((newPresets: FilterPreset[]) => {
    setPresets(newPresets);
    localStorage.setItem(`saved-filters-${storageKey}`, JSON.stringify(newPresets));
  }, [storageKey]);

  // Check if there are any active filters
  const hasActiveFilters = Object.values(currentFilters).some((v) => v && v !== 'all') || 
    (currentSearchValue && currentSearchValue.length > 0);

  // Save current filters as a new preset
  const handleSavePreset = () => {
    if (!presetName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a name for this preset.',
        variant: 'destructive',
      });
      return;
    }

    const newPreset: FilterPreset = {
      id: `preset-${Date.now()}`,
      name: presetName.trim(),
      filters: { ...currentFilters },
      searchValue: currentSearchValue,
      createdAt: new Date().toISOString(),
      isFavorite: false,
    };

    savePresets([newPreset, ...presets]);
    setPresetName('');
    setIsSaveDialogOpen(false);

    toast({
      title: 'Preset saved',
      description: `"${newPreset.name}" has been saved.`,
    });
  };

  // Load a preset
  const handleLoadPreset = (preset: FilterPreset) => {
    onLoadPreset(preset.filters, preset.searchValue);
    toast({
      title: 'Preset loaded',
      description: `"${preset.name}" filters applied.`,
    });
  };

  // Delete a preset
  const handleDeletePreset = (presetId: string, presetName: string) => {
    savePresets(presets.filter((p) => p.id !== presetId));
    toast({
      title: 'Preset deleted',
      description: `"${presetName}" has been removed.`,
    });
  };

  // Toggle favorite
  const handleToggleFavorite = (presetId: string) => {
    savePresets(
      presets.map((p) =>
        p.id === presetId ? { ...p, isFavorite: !p.isFavorite } : p
      )
    );
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Count active filters
  const countActiveFilters = (filters: Record<string, string>) => {
    return Object.values(filters).filter((v) => v && v !== 'all').length;
  };

  // Sort presets (favorites first, then by date)
  const sortedPresets = [...presets].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Save Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsSaveDialogOpen(true)}
          disabled={!hasActiveFilters}
          title={hasActiveFilters ? 'Save current filters' : 'Apply filters first to save'}
        >
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>

        {/* Load Preset Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" disabled={presets.length === 0}>
              <FolderOpen className="h-4 w-4 mr-2" />
              Load
              {presets.length > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {presets.length}
                </Badge>
              )}
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            {sortedPresets.length === 0 ? (
              <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                No saved presets yet.
                <br />
                Apply filters and click Save.
              </div>
            ) : (
              <>
                {sortedPresets.map((preset, index) => (
                  <div key={preset.id}>
                    {index > 0 && <DropdownMenuSeparator />}
                    <div className="px-2 py-1.5">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleToggleFavorite(preset.id);
                            }}
                            className="text-muted-foreground hover:text-yellow-500"
                          >
                            {preset.isFavorite ? (
                              <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                            ) : (
                              <StarOff className="h-3.5 w-3.5" />
                            )}
                          </button>
                          <span className="font-medium text-sm">{preset.name}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeletePreset(preset.id, preset.name);
                          }}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <Clock className="h-3 w-3" />
                        {formatDate(preset.createdAt)}
                        <span>•</span>
                        {countActiveFilters(preset.filters)} filter
                        {countActiveFilters(preset.filters) !== 1 ? 's' : ''}
                        {preset.searchValue && ` • "${preset.searchValue.substring(0, 15)}..."`}
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full h-7 text-xs"
                        onClick={() => handleLoadPreset(preset)}
                      >
                        Apply Preset
                      </Button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Save Dialog */}
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Filter Preset</DialogTitle>
            <DialogDescription>
              Save the current filter configuration for quick access later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="preset-name" className="text-sm font-medium">
                Preset Name
              </label>
              <Input
                id="preset-name"
                placeholder="e.g., Critical Server Assets"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSavePreset()}
              />
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-sm font-medium mb-2">Current Filters:</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(currentFilters)
                  .filter(([, value]) => value && value !== 'all')
                  .map(([key, value]) => (
                    <Badge key={key} variant="secondary">
                      {key}: {value}
                    </Badge>
                  ))}
                {currentSearchValue && (
                  <Badge variant="secondary">search: {currentSearchValue}</Badge>
                )}
                {!hasActiveFilters && (
                  <span className="text-sm text-muted-foreground">No filters applied</span>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePreset} disabled={!presetName.trim()}>
              <Save className="h-4 w-4 mr-2" />
              Save Preset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}








