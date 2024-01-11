import { literal } from "sequelize";
import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: 'todo'})
export class Todo extends Model {
    @PrimaryKey
    @Column({
		type: DataType.UUIDV4,
		defaultValue: DataType.UUIDV4,
	})
    id: string

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