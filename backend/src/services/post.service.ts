import { Category } from "../models/category";
import { Post } from "../models/post";
import { Tag } from "../models/tag";
import { User } from "../models/user";

export const getAllPosts = (filters: { categoryId?: number; tagId?: number; userId?: number }) => {

    let where: any = {};

    if (filters.categoryId) {
        where['categoryId'] = filters.categoryId;
    }
    if (filters.userId) {
        where['userId'] = filters.userId;
    }

    console.log('================================ QUERY ');
    console.log('Generated Query:', Post.findAll({ where }).toString());
    return Post.findAll({
        where,
        include: [
            Category,
            {
                model: User,
                attributes: {
                    exclude: ['password']
                }
            },
            {
                model: Tag,
                where: filters.tagId ? { id: filters.tagId } : undefined
            }
        ],
        order: [
            ['createdAt', 'DESC']
        ]
    });
}

export const getPostBySlug = (slug: string) => {
    return Post.findOne({
        include: [Category],
        where: {
            slug
        }
    });
}

export const addPost = async (title: string, content: string, categoryId: number, userId: number, slug: string) => {
    const post = new Post();
    post.title = title;
    post.content = content;
    post.categoryId = categoryId;
    post.userId = userId;
    post.slug = slug;

    return post.save();
}

export const getPostById = (id: number) => {
    return Post.findByPk(id);
}

export const updatePost = async (id: number, title?: string, content?: string, categoryId?: number, slug?: string) => {
    const post = await getPostById(id);

    if (!post)
        throw new Error("Post not found");

    if (title)
        post.title = title;

    if (content)
        post.content = content;

    if (categoryId)
        post.categoryId = categoryId;

    if (slug)
        post.slug = slug;

    return post.save();
}


export const deletePost = (id: number | number[]) => {
    return Post.destroy({
        where: {
            id
        }
    })
}