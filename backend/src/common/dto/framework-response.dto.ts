import { ApiProperty } from '@nestjs/swagger';

export class FrameworkResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  code?: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  region?: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

