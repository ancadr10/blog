import { Table, Model, Column, HasMany, Default, DataType } from "sequelize-typescript"
import Post from "./post";
import Comment from "./comment";
import Token from "./token";
import Category from "./category";
import Tag from "./tag";

@Table
export class User extends Model<User> {

    @Column({
        allowNull: false
    })
    name?: string;


    @Column({
        unique: true,
        allowNull: false
    })
    email?: string;

    
    @Default('pending')
    @Column({
      allowNull: false,
      type: DataType.ENUM('active', 'pending')
    })
    status?: string;


    @Column({
        allowNull: false
    })
    password?: string;
    

    //one user can have multiple posts
    @HasMany(() => Post)
    posts?: Post[] = [];

    @HasMany(() => Comment)
    comments?: Comment[] = [];

    @HasMany(() => Token)
    tokens?: Token[] = [];

    @HasMany(() => Category)
    categories?: Category[] = [];

    @HasMany(() => Tag)
    tags?: Tag[] = [];

}

export default User;


// const user = await User.findByPk(userId);

// const posts = await Post.findAll({
//     where: {
//         userId: user.id
//     }
// });


// const user = await User.findByPk(userId, {
//     include: [Post]
// });