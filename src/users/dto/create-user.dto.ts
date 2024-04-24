import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Salima', description: 'User name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Salima@mail.uz', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Uzbek1$t0n', description: 'User password' })
  @IsStrongPassword()
  password: string;
}
