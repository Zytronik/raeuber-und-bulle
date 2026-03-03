import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { LoginDto } from './dto/login.dto';
import { UserRequestDto } from 'src/user/dto/user-request.dto';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtPayloadDto } from './dto/jwt-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(userDto: UserRequestDto): Promise<UserResponseDto> {
    const existing = await this.usersRepository.findOne({
      where: [{ email: userDto.email }, { username: userDto.username }],
    });
    if (existing) {
      throw new UnauthorizedException('Email or username already exists');
    }

    const passwordHash = await bcrypt.hash(userDto.password, 10);

    const user = this.usersRepository.create({
      username: userDto.username,
      email: userDto.email,
      passwordHash,
    });

    await this.usersRepository.save(user);
    return {
      uid: user.uid,
      username: user.username,
      email: user.email,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
    });

    if (
      !user ||
      !(await bcrypt.compare(loginDto.password, user.passwordHash))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayloadDto = { sub: user.uid, username: user.username };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
