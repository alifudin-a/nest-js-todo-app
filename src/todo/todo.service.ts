import { Injectable } from '@nestjs/common';
import { TodoDTO } from './dto/todo.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Todo } from './entities/todo.entity';
import { FindOptions } from 'sequelize';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo)
    private todoModel: typeof Todo,
  ) {}

  async findAll(filter?: FindOptions<Todo>): Promise<Todo[]> {
    return this.todoModel.findAll(filter);
  }

  async findOne(filter?: FindOptions<Todo>): Promise<Todo> {
    return this.todoModel.findOne(filter);
  }

  async count(filter?: FindOptions<Todo>): Promise<number> {
    return this.todoModel.count(filter);
  }

  async create(data: Partial<TodoDTO>) {
    return this.todoModel.create(data);
  }

  async update(id: string, data: Partial<TodoDTO>) {
    return this.todoModel.update(data, {
      where: {
        id,
      },
      returning: false,
    });
  }
}
