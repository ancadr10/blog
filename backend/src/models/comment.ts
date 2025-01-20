import { Column, Table, Model, ForeignKey, BelongsTo } from "sequelize-typescript";
import User from "./user";
import Post from "./post";

@Table
export class Comment extends Model<Comment> {

    @Column({
        allowNull: false
    })
    content?: string;

    @ForeignKey(() => User)
    @Column({
        allowNull: false
    })
    userId?: number;

    @ForeignKey(() => Post)
    @Column({
        allowNull: false
    })
    postId?: number;

    @BelongsTo(() => Post)
    post?: Post

    @BelongsTo(() => User)
    user?: User
}

export default Comment;