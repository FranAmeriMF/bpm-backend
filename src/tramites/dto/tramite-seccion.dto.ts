import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { TramiteCampoDto } from './tramite-campo.dto';

export class TramiteSeccionDto {
  @ApiProperty({ example: 'uuid-seccion', description: 'ID de la sección (SeccionTipoTramite)' })
  @IsUUID()
  @IsNotEmpty()
  seccion_id!: string;

  @ApiProperty({ type: [TramiteCampoDto], description: 'Valores de los campos de esta sección' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TramiteCampoDto)
  campos!: TramiteCampoDto[];
}
