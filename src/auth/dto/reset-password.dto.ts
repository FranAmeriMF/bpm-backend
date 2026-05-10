import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ description: 'Token recibido por email' })
  @IsString()
  token: string;

  @ApiProperty({ example: 'NuevaPass123!', minLength: 8 })
  @IsString()
  @MinLength(8)
  nueva_password: string;
}
