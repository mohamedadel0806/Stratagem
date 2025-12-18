import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { BulkOperationsService } from '../services/bulk-operations.service';
import { BulkUpdateDto, BulkUpdateResponseDto } from '../dto/bulk-update.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';

@ApiTags('Bulk Operations')
@Controller('assets/bulk')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BulkOperationsController {
  constructor(private readonly bulkOperationsService: BulkOperationsService) {}

  @Post(':assetType/update')
  @ApiOperation({ summary: 'Bulk update assets' })
  @ApiParam({ name: 'assetType', enum: ['physical', 'information', 'application', 'software', 'supplier'] })
  @ApiResponse({ status: 200, description: 'Bulk update completed', type: BulkUpdateResponseDto })
  async bulkUpdate(
    @Param('assetType') assetType: 'physical' | 'information' | 'application' | 'software' | 'supplier',
    @Body() dto: BulkUpdateDto,
    @CurrentUser() user: User,
  ): Promise<BulkUpdateResponseDto> {
    return this.bulkOperationsService.bulkUpdate(assetType, dto, user.id);
  }

  @Post(':assetType/delete')
  @ApiOperation({ summary: 'Bulk delete assets' })
  @ApiParam({ name: 'assetType', enum: ['physical', 'information', 'application', 'software', 'supplier'] })
  @ApiResponse({ status: 200, description: 'Bulk delete completed', type: BulkUpdateResponseDto })
  async bulkDelete(
    @Param('assetType') assetType: 'physical' | 'information' | 'application' | 'software' | 'supplier',
    @Body() body: { assetIds: string[] },
    @CurrentUser() user: User,
  ): Promise<BulkUpdateResponseDto> {
    return this.bulkOperationsService.bulkDelete(assetType, body.assetIds);
  }
}









