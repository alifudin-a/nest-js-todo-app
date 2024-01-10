import { literal } from "sequelize";
import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

export enum ETodoStatus {
    TODO = 'to do',
    ONPROGRESS = 'on progress',
    DONE = 'done'
}

@Table({ tableName: 'todo'})
export class Todo extends Model {
    @PrimaryKey
    @Column
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