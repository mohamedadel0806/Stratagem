/**
 * Interface for asset import handlers
 * Each asset type implements this interface to handle its specific import logic
 */
export interface AssetImportHandler {
  /**
   * Map CSV/Excel row data to asset DTO using field mapping
   */
  mapFields(row: Record<string, any>, mapping: Record<string, string>): any;

  /**
   * Validate asset data before import
   */
  validate(data: any): string[];

  /**
   * Create asset using the appropriate service
   */
  createAsset(data: any, userId: string): Promise<any>;
}







