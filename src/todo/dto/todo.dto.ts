import {
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ESort } from 'src/config/enum/enum';

export enum ETodoStatus {
  TODO = 'to_do',
  ONPROGRESS = 'on_progress',
  DONE = 'done',
}

export class TodoDTO {
  @IsUUID()
  userId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsEnum(ETodoStatus)
  status: ETodoStatus;
}

export class TodoFilterDTO {
  @IsUUID()
  id: string;
}

export class TodoListQueryParamDTO {
  @IsOptional()
  @IsString()
  orderBy: string;

  @IsOptional()
  @IsEnum(ESort)
  sort: ESort;

  @IsNumberString()
  limit: number;

  @IsNumberString()
  offset: number;

  @IsOptional()
  @IsEnum(ETodoStatus)
  status: ETodoStatus
}
