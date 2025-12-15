import { AssetImportHandler } from './asset-import-handler.interface';
export declare abstract class BaseImportHandler implements AssetImportHandler {
    abstract mapFields(row: Record<string, any>, mapping: Record<string, string>): any;
    abstract validate(data: any): string[];
    abstract createAsset(data: any, userId: string): Promise<any>;
    protected parseBoolean(value: any): boolean;
    protected parseDate(value: any): string | undefined;
    protected parseArray(value: any): string[];
    protected parseNumber(value: any): number | undefined;
    protected normalizeEnumValue(value: any, mappings: Record<string, string>): string;
}
