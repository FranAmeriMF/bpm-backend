import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';

export class AsignarOficinaItemDto {
  @ApiProperty({ example: 'uuid-oficina', description: 'ID de la oficina municipal' })
  @IsUUID()
  @IsNotEmpty()
  oficina_id!: string;
}

export class AsignarTramiteDto {
  @ApiProperty({ type: [AsignarOficinaItemDto], description: 'Oficinas a las que se asigna el trámite' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AsignarOficinaItemDto)
  oficinas!: AsignarOficinaItemDto[];

  @ApiProperty({ example: 'uuid-jefe-decisor', description: 'Jefe de oficina que tomará la decisión final' })
  @IsUUID()
  @IsNotEmpty()
  jefe_decisor_id!: string;
}
