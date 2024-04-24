import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    example: 'salima@mail.uz',
    description: 'User email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Uzbek1$t0n', description: 'User password' })
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
