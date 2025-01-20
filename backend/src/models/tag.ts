import { BelongsTo, BelongsToMany, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import PostTag from "./postTag";
import Post from "./post";
import User from "./user";

@Table
export class Tag extends Model<Tag> {

    @Column({
        allowNull: false
    })
    name?: string;

    @Column({
        allowNull: false,
        unique: true
    })
    slug?: string

    @ForeignKey(() => User)
    @Column({
        allowNull: false
    })
    userId?: number;
    
    @BelongsTo(() => User)
    user?: User;
    
    @BelongsToMany(() => Post, () => PostTag)
    posts: Post[] = [];
}

export default Tag;