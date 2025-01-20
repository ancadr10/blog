import { Column, Table, Model, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, HasMany, BelongsToMany } from "sequelize-typescript";
import User from "./user";
import Comment from "./comment";
import Tag from "./tag";
import PostTag from "./postTag";
import Category from "./category";

@Table
export class Post extends Model<Post> {

    @Column({
        allowNull: false
    })
    title?: string;

    @Column({
        allowNull: false
    })
    content?: string;

    @Column({
        allowNull: false,
        unique: true
    })
    slug?: string;

    @ForeignKey(() => User)
    @Column({
        allowNull: false
    })
    userId?: number;

    @ForeignKey(() => Category)
    @Column({
        allowNull: false
    })
    categoryId?: number;

    //each post belongs to a user
    @BelongsTo(() => User)
    user?: User;

    @BelongsTo(() => Category)
    category?: Category;

    @HasMany(() => Comment)
    comments: Comment[] = [];

    //many to many relationship
    @BelongsToMany(() => Tag, () => PostTag)
    tags: Tag[] = [];
}
export default Post;

// // with @BelongsTo
// Post.findByPk(1, {
//     include: [User]
// })

// // without @BelongsTo
// let post =  await Post.findByPk(1);
// let user = await User.findByPk(post?.userId);