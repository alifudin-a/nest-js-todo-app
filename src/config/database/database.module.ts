import { Module } from "@nestjs/common";
import { SequelizeModule } from '@nestjs/sequelize'
import { ConfigModule } from '@nestjs/config'
import { Todo } from "src/todo/entities/todo.entity";


@Module({
    imports: [
        SequelizeModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: () => ({
                uri: process.env.DB_URI,
                dialect: 'postgres',
                models: [
                    Todo,
                ],
                username: process.env.DB_USER,
                ssl: false,
            })
        })
    ]
})

export class DatabaseModule{}