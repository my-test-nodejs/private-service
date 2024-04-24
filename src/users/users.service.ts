import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Observable, from, of } from 'rxjs';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPlayload, Tokens } from '../types';
import * as bcrypt from 'bcrypt';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const jwtPlayload: JwtPlayload = {
      email: email,
      userId: userId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPlayload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(jwtPlayload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_KEY_TIME,
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async updateRefreshTokenHash(
    useId: number,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 7);
    await this.userRepo.update(
      { id: useId },
      { hashed_refresh_token: hashedRefreshToken },
    );
  }

  async register(data: CreateUserDto) {
    const user = await this.userRepo.findOne({
      where: { email: data.email },
    });

    if (user) {
      throw new BadRequestException('Email already exists!');
    }
    console.log('--', data);

    const hashed_password = await bcrypt.hash(data.password, 7);
    const newUser = await this.userRepo.save({
      ...data,
      hashed_password: hashed_password,
    });

    const token = await this.getTokens(newUser.id, newUser.email);
    const hashed_refresh_token = await bcrypt.hash(token.refresh_token, 7);

    await this.userRepo.update(
      { id: newUser.id },
      {
        hashed_refresh_token: hashed_refresh_token,
      },
    );

    await this.redisService.setToken(newUser.id, token);
    return token;
  }

  async login(data: LoginUserDto): Promise<Observable<object>> {
    const { email, password } = data;
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('User not registered');
    }

    const isMatchPass = await bcrypt.compare(password, user.password);

    if (!isMatchPass) {
      throw new UnauthorizedException('Admin not registered(pass)');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

    return of(tokens);
  }

  async logout(userId: number): Promise<Observable<boolean>> {
    const updatedUser = await this.userRepo.update(
      { id: userId },
      { hashed_refresh_token: null },
    );

    if (!updatedUser) throw new ForbiddenException('Access Denied');

    await this.redisService.deleteToken(userId);
    return of(true);
  }

  async refreshToken(
    user_id: number,
    refreshToken: string,
  ): Promise<Observable<Tokens>> {
    const user = await this.userRepo.findOne({ where: { id: user_id } });
    if (!user || !user.hashed_refresh_token) {
      throw new BadRequestException('Access Denied');
    }

    const tokentMatch = await bcrypt.compare(
      refreshToken,
      user.hashed_refresh_token,
    );
    if (!tokentMatch) {
      throw new ForbiddenException('Forbidden');
    }

    const token = await this.getTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, token.refresh_token);

    return of(token);
  }

  findAll(): Observable<User[]> {
    return from(this.userRepo.find());
  }

  async findOne(data: { id: string }): Promise<Observable<User>> {
    const user = await this.userRepo.findOne({ where: { id: +data.id } });

    if (!user) {
      throw new BadRequestException('User not found');
    }
    return of(user);
  }
}
