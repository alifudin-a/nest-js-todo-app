import { IsEmail, IsOptional, IsString } from 'class-validator';

export enum ERole {
    ADMIN = 'admin',
    USER = 'user'
}

export class UserDTO {
  @IsString()
  name: string;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsEmail()
  email: string;
}
