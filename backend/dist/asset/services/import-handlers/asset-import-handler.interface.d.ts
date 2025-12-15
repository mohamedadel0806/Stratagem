export interface AssetImportHandler {
    mapFields(row: Record<string, any>, mapping: Record<string, string>): any;
    validate(data: any): string[];
    createAsset(data: any, userId: string): Promise<any>;
}
