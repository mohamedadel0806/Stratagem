import { AssetImportHandler } from './asset-import-handler.interface';

/**
 * Base class for asset import handlers with common utility methods
 */
export abstract class BaseImportHandler implements AssetImportHandler {
  abstract mapFields(row: Record<string, any>, mapping: Record<string, string>): any;
  abstract validate(data: any): string[];
  abstract createAsset(data: any, userId: string): Promise<any>;

  /**
   * Parse boolean value from various formats
   */
  protected parseBoolean(value: any): boolean {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      const lower = value.toLowerCase().trim();
      return lower === 'true' || lower === 'yes' || lower === '1' || lower === 'y';
    }
    return Boolean(value);
  }

  /**
   * Parse date from various formats
   */
  protected parseDate(value: any): string | undefined {
    if (!value) return undefined;

    try {
      const date = new Date(value);
      if (isNaN(date.getTime())) return undefined;
      return date.toISOString().split('T')[0];
    } catch {
      return undefined;
    }
  }

  /**
   * Parse array from comma/semicolon-separated string
   */
  protected parseArray(value: any): string[] {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      return value.split(/[;,]/).map((v) => v.trim()).filter(Boolean);
    }
    return value ? [value] : [];
  }

  /**
   * Parse number from string
   */
  protected parseNumber(value: any): number | undefined {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? undefined : parsed;
    }
    return undefined;
  }

  /**
   * Normalize enum values (case-insensitive, handle spaces/underscores)
   */
  protected normalizeEnumValue(value: any, mappings: Record<string, string>): string {
    if (typeof value !== 'string') return value;

    const normalized = value.toLowerCase().trim().replace(/\s+/g, '_');
    return mappings[normalized] || normalized;
  }
}





