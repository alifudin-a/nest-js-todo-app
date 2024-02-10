import { Module } from '@nestjs/common';
import { TodoModule } from './todo/todo.module';
import { DatabaseModule } from './config/database/database.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    DatabaseModule,
    TodoModule,
    AuthModule,
    UserModule,
    CacheModule.register<RedisClientOptions>({
      // @ts-ignore
      store: async () =>
        await redisStore({
          url: process.env.CACHE_URL,
        }),
      ttl: 60,
      max: 10,
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
