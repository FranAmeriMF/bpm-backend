import { PartialType } from '@nestjs/swagger';
import { CreateOficinaEmpresaDto } from './create-oficina-empresa.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { OficinaEmpresaStatus } from '@prisma/client';

export class UpdateOficinaEmpresaDto extends PartialType(CreateOficinaEmpresaDto) {
  @ApiPropertyOptional({ enum: OficinaEmpresaStatus })
  @IsOptional()
  @IsEnum(OficinaEmpresaStatus)
  estado?: OficinaEmpresaStatus;
}
