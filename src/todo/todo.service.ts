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
}
