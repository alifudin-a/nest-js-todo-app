import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { FindOptions } from 'sequelize';
import { ERole, UserDTO } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findOne(filter?: FindOptions<User>): Promise<User> {
    return this.userModel.findOne(filter);
  }

  async count(filter?: FindOptions<User>): Promise<number> {
    return this.userModel.count(filter)
  }

  async create(data: UserDTO) {
    const payload: Partial<User> = {
      name: data.name,
      username: data.username,
      password: data.password,
      email: data.email,
      role: ERole.USER,
    };

    return this.userModel.create(payload);
  }

  async update(id: string, data: UserDTO) {
    const payload: Partial<User> = {
      name: data.name,
      email: data.email,
    };

    return this.userModel.update(payload, {
      where: {
        id,
      },
    });
  }
}
