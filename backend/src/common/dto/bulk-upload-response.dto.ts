import { ApiProperty } from '@nestjs/swagger';

export class BulkUploadResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  totalRows: number;

  @ApiProperty()
  created: number;

  @ApiProperty()
  deleted: number;

  @ApiProperty()
  errors: number;

  @ApiProperty({ required: false, type: [String] })
  errorMessages?: string[];
}

