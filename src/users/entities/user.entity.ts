import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @ApiProperty({ example: 1, description: 'Unical id' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Salima', description: 'User name' })
  @Column()
  name: string;

  @ApiProperty({ example: 'Salima@mail.uz', description: 'User email' })
  @Column()
  email: string;

  @ApiProperty({ example: 'Uzbek1$t0n', description: 'User password' })
  @Column()
  password: string;

  @ApiProperty({
    example: 'vfgfgrtritfmdkm',
    description: 'User hashed refresh token',
  })
  @Column({ nullable: true })
  hashed_refresh_token: string;

}
