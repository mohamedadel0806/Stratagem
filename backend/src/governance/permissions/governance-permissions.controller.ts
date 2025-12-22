import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GovernancePermissionsService } from './governance-permissions.service';
import { CreateGovernancePermissionDto } from './dto/create-governance-permission.dto';
import { AssignRoleDto, BulkAssignRoleDto } from './dto/assign-role.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';

@ApiTags('Governance - Permissions')
@Controller('governance/permissions')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class GovernancePermissionsController {
  constructor(private readonly permissionsService: GovernancePermissionsService) { }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a governance permission' })
  @ApiResponse({ status: 201, description: 'Permission created successfully' })
  async createPermission(@Body() dto: CreateGovernancePermissionDto) {
    return this.permissionsService.createPermission(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all governance permissions' })
  @ApiResponse({ status: 200, description: 'List of permissions' })
  async getAllPermissions(@Query('role') role?: string) {
    if (role) {
      return this.permissionsService.getPermissionsByRole(role);
    }
    return this.permissionsService.getAllPermissions();
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a governance permission' })
  @ApiResponse({ status: 200, description: 'Permission deleted successfully' })
  async deletePermission(@Param('id') id: string) {
    await this.permissionsService.deletePermission(id);
    return { message: 'Permission deleted successfully' };
  }

  @Post('assign-role')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Assign a role to a user' })
  @ApiResponse({ status: 201, description: 'Role assigned successfully' })
  async assignRole(@Body() dto: AssignRoleDto, @Request() req) {
    return this.permissionsService.assignRole(dto, req.user.id);
  }

  @Post('bulk-assign-role')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Bulk assign role to multiple users' })
  @ApiResponse({ status: 201, description: 'Roles assigned successfully' })
  async bulkAssignRole(@Body() dto: BulkAssignRoleDto, @Request() req) {
    return this.permissionsService.bulkAssignRole(dto, req.user.id);
  }

  @Get('user/:userId/assignments')
  @ApiOperation({ summary: 'Get role assignments for a user' })
  @ApiResponse({ status: 200, description: 'User role assignments' })
  async getUserRoleAssignments(@Param('userId') userId: string) {
    return this.permissionsService.getUserRoleAssignments(userId);
  }

  @Delete('assignments/:id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Remove a role assignment' })
  @ApiResponse({ status: 200, description: 'Role assignment removed successfully' })
  async removeRoleAssignment(@Param('id') id: string) {
    await this.permissionsService.removeRoleAssignment(id);
    return { message: 'Role assignment removed successfully' };
  }

  @Get('test/:userId')
  @ApiOperation({ summary: 'Test permissions for a user' })
  @ApiResponse({ status: 200, description: 'Permission test results' })
  async testUserPermissions(@Param('userId') userId: string) {
    return this.permissionsService.testUserPermissions(userId);
  }

  @Get('check')
  @ApiOperation({ summary: 'Check if current user has permission' })
  @ApiResponse({ status: 200, description: 'Permission check result' })
  async checkPermission(
    @Request() req,
    @Query('module') module: string,
    @Query('action') action: string,
    @Query('resourceType') resourceType?: string,
  ) {
    const hasPermission = await this.permissionsService.hasPermission(
      req.user.id,
      module as any,
      action as any,
      resourceType,
    );
    return { hasPermission };
  }
}


