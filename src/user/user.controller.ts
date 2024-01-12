import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { User } from './entities/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('/profile')
  async profile(@Req() req: Request): Promise<Partial<User>> {
    const user = await this.userService.findOne({
      where: {
        id: req['user'].id,
      },
    });

    if (!user){
      throw new HttpErrorByCode[404]('Profile not found!')
    }

    return {
      name: user.name,
      email: user.email,
      role: user.role,
      updatedAt: user.updatedAt,
    };
  }
}
