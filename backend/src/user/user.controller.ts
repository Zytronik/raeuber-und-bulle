import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get(':uid')
    findOne(@Param('uid') uid: string): Promise<User> {
        return this.userService.findOneByUid(uid);
    }

    @Post()
    create(@Body() body: { username: string; email: string; passwordHash: string }): Promise<User> {
        return this.userService.create(body);
    }
}