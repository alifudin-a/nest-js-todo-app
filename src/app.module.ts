import { Module } from '@nestjs/common';
import { TodoModule } from './todo/todo.module';
import { DatabaseModule } from './config/database/database.module';

@Module({
  imports: [DatabaseModule, TodoModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
