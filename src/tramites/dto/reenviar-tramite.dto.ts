import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { TramiteSeccionDto } from './tramite-seccion.dto';

export class ReenviarTramiteDto {
  @ApiProperty({
    type: [TramiteSeccionDto],
    description: 'Secciones con los datos corregidos',
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TramiteSeccionDto)
  secciones!: TramiteSeccionDto[];
}
