import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'ContraseñaTemporal123' })
  @IsString()
  password_actual: string;

  @ApiProperty({ example: 'MiNuevaPass456!', minLength: 8 })
  @IsString()
  @MinLength(8)
  password_nuevo: string;
}
