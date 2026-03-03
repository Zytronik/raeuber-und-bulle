import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class UserRequestDto {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
