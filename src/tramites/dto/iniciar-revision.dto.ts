import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class IniciarRevisionDto {
  @ApiProperty({ example: 'uuid-jefe', description: 'ID del jefe de oficina que inicia la revisión' })
  @IsUUID()
  @IsNotEmpty()
  jefe_id!: string;
}
