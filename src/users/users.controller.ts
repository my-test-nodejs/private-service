import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { GrpcMethod } from '@nestjs/microservices';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @GrpcMethod('UsersService')
  register(data: CreateUserDto) {
    return this.usersService.register(data);
  }

  @GrpcMethod('UsersService')
  login(data: LoginUserDto) {
    return this.usersService.login(data);
  }

  @GrpcMethod('UsersService')
  findAll()  {
    return this.usersService.findAll();
  }

  @GrpcMethod('UsersService')
  findOne(data: { id: string }) {
    return this.usersService.findOne(data);
  }

}
