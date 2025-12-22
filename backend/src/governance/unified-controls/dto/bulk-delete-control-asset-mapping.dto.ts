import { IsArray, IsUUID } from 'class-validator';

export class BulkDeleteControlAssetMappingDto {
  @IsArray()
  @IsUUID('4', { each: true })
  mapping_ids: string[];
}







