import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class TramiteCampoDto {
  @ApiProperty({ example: 'uuid-campo', description: 'ID del campo (CampoSeccionTipoTramite)' })
  @IsUUID()
  @IsNotEmpty()
  campo_id!: string;

  @ApiPropertyOptional({ description: 'Valor del campo (string, number, boolean, array para archivos, etc.)' })
  @IsOptional()
  valor?: any;
}
