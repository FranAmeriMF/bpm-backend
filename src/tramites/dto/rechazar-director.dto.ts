import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RechazarDirectorDto {
  @ApiProperty({ example: 'Falta documentación en la sección 2', description: 'Observaciones del director al rechazar' })
  @IsNotEmpty()
  @IsString()
  observaciones!: string;
}
