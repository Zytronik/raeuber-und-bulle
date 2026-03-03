import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.find();
    return users.map((user) => ({
      uid: user.uid,
      username: user.username,
      email: user.email,
    }));
  }

  async findOneByUid(uid: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({ where: { uid } });

    if (!user) {
      throw new NotFoundException(`User with uid "${uid}" not found`);
    }

    return {
      uid: user.uid,
      username: user.username,
      email: user.email,
    };
  }
}
