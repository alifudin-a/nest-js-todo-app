import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { AuthDTO } from './dto/auth.dto';
import { IApiResponse } from 'src/config/interface/api.response';
import * as bcrypt from 'bcrypt';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { JwtService } from '@nestjs/jwt';
import { UserDTO } from 'src/user/dto/user.dto';
import { Op } from 'sequelize';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager'; // ! Don't forget this import
import { Inject } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @Post('/login')
  async login(@Body() data: AuthDTO): Promise<IApiResponse> {
    const user = await this.userService.findOne({
      where: {
        username: data.username,
      },
    });
    if (!user) {
      throw new HttpErrorByCode[401]('Invalid username or password!');
    }
    if (!data.username || !data.password) {
      throw new HttpErrorByCode[401]('Invalid username or password!');
    }

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) {
      throw new HttpErrorByCode[401]('Invalid username or password!');
    }

    const payload = { id: user.id, username: user.username, role: user.role };
    const token = await this.jwtService.signAsync(payload);

    await this.cacheManager.set(payload.id, token, 60 * 60 * 100);

    return {
      statusCode: 200,
      message: 'Successfully logged in!',
      data: {
        token,
      },
    };
  }

  @Post('/register')
  async register(@Body() data: UserDTO): Promise<IApiResponse> {
    data.username.trim();
    data.email.trim();
    data.password.trim();

    const exist = await this.userService.findOne({
      where: { [Op.or]: { username: data.username, email: data.email } },
    });
    if (exist) {
      if (exist.username === data.username) {
        throw new HttpErrorByCode[422]('Username already exist!');
      } else {
        throw new HttpErrorByCode[422]('Email already exist!');
      }
    }

    data.password = await bcrypt.hash(data.password, 12);

    return this.userService
      .create(data)
      .then(() => {
        return {
          statusCode: 200,
          message: 'Successfully register',
          totalRow: 1,
        };
      })
      .catch((err) => {
        console.log(err);
        throw new HttpErrorByCode[500]('Something went wrong');
      });
  }
}
