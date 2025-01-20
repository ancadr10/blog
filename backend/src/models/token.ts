import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import User from "./user";

@Table
export class Token extends Model<Token> {

    @Column({
        allowNull: false
    })
    token?: string;

    @ForeignKey(() => User)
    @Column({
        allowNull: false
    })
    userId?: number;

    
    @Column({
        type: DataType.ENUM('activation', 'reset', 'access', 'refresh'),
        allowNull: false
    })
    type?: 'activation' | 'reset' | 'access' | 'refresh';

    @BelongsTo(() => User)
    user?: User;
}

export default Token;