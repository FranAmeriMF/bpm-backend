import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@municipio.gov.ar', description: 'Email del usuario' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'Admin1234!', description: 'Contraseña' })
  @IsString()
  @MinLength(6)
  password!: string;
}
