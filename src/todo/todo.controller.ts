import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  ParseUUIDPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoDTO, TodoFilterDTO, TodoListQueryParamDTO } from './dto/todo.dto';
import { IApiResponse } from 'src/config/interface/api.response';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { Request } from 'express';
import { ESort } from 'src/config/enum/enum';
import { AuthGuard } from 'src/auth/auth.guard';
import { Todo } from './entities/todo.entity';
import { WhereOptions } from 'sequelize';
import { User } from 'src/user/entities/user.entity';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @UseGuards(AuthGuard)
  @Get('/list')
  async findAll(
    @Req() req: Request,
    @Query() query: TodoListQueryParamDTO,
  ): Promise<IApiResponse> {
    query.limit = !query.limit || query.limit < 0 ? 100 : query.limit;
    query.offset = !query.offset || query.offset < 0 ? 0 : query.offset;

    if (query.limit > 1000) {
      query.limit = 1000;
    }

    if (query.orderBy) {
      if (!query.sort) {
        query.sort = ESort.DESC;
      }
    } else {
      query.orderBy = 'createdAt';
    }

    if (query.sort) {
      if (!query.orderBy) {
        query.orderBy = 'createdAt';
      }
    } else {
      query.sort = ESort.DESC;
    }

    const where: WhereOptions<Todo> = {
      userId: req['user'].id,
      ...(query.status ? { status: query.status } : undefined),
    };

    const todos = await this.todoService.findAll({
      where,
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
      limit: query.limit,
      offset: query.offset,
      order: [[query.orderBy, query.sort]],
    });

    const count = await this.todoService.count({ where });

    return {
      statusCode: 200,
      message: 'Succesfully show todo list',
      totalRow: count,
      data: todos,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/detail/:id')
  async findOne(
    @Req() req: Request,
    @Param() param: TodoFilterDTO,
  ): Promise<IApiResponse> {
    const todo = await this.todoService.findOne({
      where: {
        id: param.id,
        userId: req['user'].id,
      },
    });

    if (!todo) {
      throw new HttpErrorByCode[404]('Data todo not found!');
    }

    return {
      statusCode: 200,
      message: 'Successfully show todo detail',
      totalRow: 1,
      data: todo,
    };
  }

  @UseGuards(AuthGuard)
  @Post('/create')
  async create(
    @Req() req: Request,
    @Body() data: TodoDTO,
  ): Promise<IApiResponse> {
    if (data.userId !== req['user'].id) {
      throw new HttpErrorByCode[403]('Invalid userId!');
    }

    return this.todoService
      .create(data)
      .then(() => {
        return {
          statusCode: 200,
          message: 'Successfully create todo',
        };
      })
      .catch((err) => {
        console.log(err);
        throw new HttpErrorByCode[500]('Something went wrong');
      });
  }

  @UseGuards(AuthGuard)
  @Put('/update/:id')
  async updateById(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: TodoDTO,
  ): Promise<IApiResponse> {
    if (data.userId !== req['user'].id) {
      throw new HttpErrorByCode[403]('Invalid userId');
    }

    return this.todoService
      .update(id, data)
      .then(() => {
        return {
          statusCode: 200,
          message: 'Successfully update todo',
        };
      })
      .catch((err) => {
        console.log(err);
        throw new HttpErrorByCode[500]('Something went wrong');
      });
  }
}
