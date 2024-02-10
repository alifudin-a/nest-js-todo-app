import { literal } from "sequelize";
import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({tableName: 'user'})
export class User extends Model {
    @PrimaryKey
    @Column({
		type: DataType.UUIDV4,
		defaultValue: DataType.UUIDV4,
	})
    id: string
    
    @Column
    username: string

    @Column
    password: string

    @Column
    name: string

    @Column
    email: string

    @Column({
		type: DataType.ENUM('admin', 'user'),
	})
    role: string
    
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