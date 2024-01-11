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
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoDTO, TodoFilterDTO, TodoListQueryParamDTO } from './dto/todo.dto';
import { IApiResponse } from 'src/config/interface/api.response';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { Request } from 'express';
import { ESort } from 'src/config/enum/enum';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get('/list')
  async findAll(@Query() query: TodoListQueryParamDTO): Promise<IApiResponse> {
    query.limit = !query.limit || query.limit < 0 ? 100 : query.limit
    query.offset = !query.offset || query.offset < 0 ? 0 : query.offset

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

    const todos = await this.todoService.findAll({
      limit: query.limit,
      offset: query.offset,
      order: [[query.orderBy, query.sort]],
    });

    const count = await this.todoService.count()

    return {
      statusCode: 200,
      message: 'Succesfully show todo list',
      totalRow: count,
      data: todos,
    };
  }

  @Get('/detail/:id')
  async findOne(@Param() param: TodoFilterDTO): Promise<IApiResponse> {
    const todo = await this.todoService.findOne({
      where: {
        id: param.id,
      },
    });

    return {
      statusCode: 200,
      message: 'Successfully show todo detail',
      totalRow: 1,
      data: todo,
    };
  }

  @Post('/create')
  async create(@Body() data: TodoDTO): Promise<IApiResponse> {
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

  @Put('/update/:id')
  async updateById(@Param('id', ParseUUIDPipe) id: string, @Body() data: TodoDTO): Promise<IApiResponse>{
    return this.todoService.update(id, data).then(() => {
      return {
        statusCode: 200,
        message: 'Successfully update todo',
      };
    }).catch(err => {
      console.log(err)
      throw new HttpErrorByCode[500]('Something went wrong')
    })
  }
}
