import { Request, Response } from "express";
import { addCategory, deleteCategory, getAllCategories, getCategoryById, getCategoryBySlug, updateCategory } from "../services/category.service";
import { generateSlug } from "../shared/general.util";
import { z } from "zod";
import User from "../models/user";
import { deletePost, getAllPosts } from "../services/post.service";
import Post from "../models/post";
import { deletePostTagRelations } from "../services/post-tag.service";
import { deletePostComments } from "../services/comment.service";


export const getCategories = async (req: Request, res: Response): Promise<any> => {
    const user = (req as any).user as User;
    const categories = await getAllCategories({
        userId: user.get('id')
    });

    return res.json(categories);
}

export const getCategoryBySlugController = async (req: Request, res: Response): Promise<any> => {
    const slug = req.params.slug;
    const category = await getCategoryBySlug(slug);

    if (!category) {
        return res.status(404).json({ messgae: 'Category not found.' });
    }

    return res.json(category);
}

export const addCategoriesController = async (req: Request, res: Response): Promise<any> => {

    const schema = z.object({
        name: z.string()
    });

    const user = (req as any).user as User;

    const schemaValidator = schema.safeParse(req.body);
    if (!schemaValidator.success) {
        return res.status(400).json({ messgae: 'Invalid data', errors: schemaValidator.error });
    }

    const { name } = req.body;

    const userId = user.get('id');

    let slug = generateSlug(name);

    const categoryBySlug = await getCategoryBySlug(slug);
    if (categoryBySlug) {
        slug = generateSlug(name, true);
    }

    const category = await addCategory(name, slug, userId);
    return res.json(category);
}

export const updateCategoryController = async (req: Request, res: Response): Promise<any> => {

    const schema = z.object({
        name: z.string(),
        id: z.number()
    });

    const schemaValidator = schema.safeParse(req.body);
    if (!schemaValidator.success) {
        return res.status(400).json({ messgae: 'Invalid data', errors: schemaValidator.error });
    }

    let { name, id } = req.body;
    let slug = generateSlug(name);

    const categoryBySlug = await getCategoryBySlug(slug);
    if (categoryBySlug) {
        return res.status(400).json({ messgae: 'Category already exists' });
    }

    //check if category exists by the given name
    let dbCategory = await getCategoryById(id);
    if (!dbCategory) {
        return res.status(404).json({ messgae: 'Category not found' });
    }

    //update category
    let updatedCategory = await updateCategory(name, slug, id);
    return res.json(updatedCategory);
}

export const deleteCategoryController = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.body;

    const category = await getCategoryById(id);
    if (!category) {
        return res.status(404).json({ messgae: 'Category not found' });
    }

    //get all posts that belong to the category
    const posts = await getAllPosts({
        categoryId: id
    });

    const postIds = posts.map((post: Post) => post.get('id'));

    await deletePostTagRelations({ postId: postIds });   //delete post tag relations

    await deletePostComments(postIds);   //delete all the comments linked to a post

    await deletePost(postIds);   // delete all related posts

    await deleteCategory(id);

    return res.json(category);
}