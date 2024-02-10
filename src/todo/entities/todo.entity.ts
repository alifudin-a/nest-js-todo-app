import { literal } from "sequelize";
import { BelongsTo, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "src/user/entities/user.entity";

@Table({ tableName: 'todo'})
export class Todo extends Model {
    @PrimaryKey
    @Column({
		type: DataType.UUIDV4,
		defaultValue: DataType.UUIDV4,
	})
    id: string

    @BelongsTo(() => User, 'userId')
    user: User

    @Column({
        field: 'userid'
    })
    userId: string

    @Column
    title: string

    @Column
    description: string

    @Column({
        type: DataType.ENUM('to do', 'on progress', 'done')
    })
    status: string

    @Column({
		field: 'createdat',
		defaultValue: literal('CURRENT_TIMESTAMP'),
	})
	createdAt: Date

    @Column({
		field: 'updatedat',
	})
	updatedAt?: Date
}