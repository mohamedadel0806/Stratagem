import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsObject } from 'class-validator';

export enum SignatureMethod {
  DRAWN = 'drawn',
  UPLOADED = 'uploaded',
}

export class CaptureSignatureDto {
  @ApiProperty({ description: 'Base64 encoded signature image' })
  @IsNotEmpty()
  @IsString()
  signatureData: string;

  @ApiProperty({ enum: SignatureMethod, description: 'Method used to capture signature' })
  @IsEnum(SignatureMethod)
  signatureMethod: SignatureMethod;

  @ApiProperty({ 
    description: 'Additional metadata about the signature (IP, user agent, etc.)',
    required: false 
  })
  @IsOptional()
  @IsObject()
  signatureMetadata?: Record<string, any>;
}