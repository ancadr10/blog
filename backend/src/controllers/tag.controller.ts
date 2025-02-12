import { Request, Response } from "express";
import { addTag, deleteTag, getAllTags, getAllTagsPaginated, getTagById, getTagBySlug } from "../services/tag.service";
import { z } from "zod";
import { generateSlug } from "../shared/general.util";
import { getPostById } from "../services/post.service";
import { deletePostTagRelations, getPostTags } from "../services/post-tag.service";
import User from "../models/user";

export const getTagsController = async (req: Request, res: Response): Promise<any> => {
    const user = (req as any).user as User;

    const tags = await getAllTags({
        userId: user.get('id')
    });

    return res.json(tags);
};

export const getTagsPaginated = async (req: Request, res: Response): Promise<any> => {
    const user = (req as any).user as User;

    const {
        page = 0,
        size = 5,
        sortField = 'id',
        sortOrder = 'DESC',
        filters = {}
    } = req.body;

    const limit = parseInt(size, 10);
    const offset = parseInt(page, 10) * limit;

    const { partialElements, total } = await getAllTagsPaginated({
        userId: user.get('id'),
        limit,
        offset,
        sortField,
        sortOrder,
        filters
    });

    return res.json({
        partialElements,
        total,
        page,
        size: limit,
    });

}

export const addTagController = async (req: Request, res: Response): Promise<any> => {

    const schema = z.object({
        name: z.string()
    });

    //see authenticateJWT middleware
    const user: User = (req as any).user;

    const userId = user.get('id');

    const schemaValidator = schema.safeParse(req.body);
    if (!schemaValidator.success) {
        return res.status(400).json({
            message: "Invalid data",
            errors: schemaValidator.error,
        });
    }

    const { name } = req.body;

    let slug = generateSlug(name);

    const tagAlreadyExists = await getTagBySlug(slug);
    if (tagAlreadyExists) {
        slug = generateSlug(name, true);
    }

    const newTag = await addTag(name, slug, userId);

    return res.json(newTag);
};

export const updateTagController = async (req: Request, res: Response): Promise<any> => {
    const schema = z.object({
        name: z.string(),
        id: z.number(),
    });

    const schemaValidator = schema.safeParse(req.body);

    if (!schemaValidator.success) {
        return res.status(400).json({
            message: "Invalid data",
            errors: schemaValidator.error,
        });
    }

    const { name, id } = req.body;

    const tag = await getTagById(id);

    if (!tag) {
        return res.status(404).json({ message: "Tag not found" });
    }

    if (tag.name === name) {
        return res.status(400).json({ message: "Nothing was changed." });

    }

    let slug = generateSlug(name);
    const tagAlreadyExists = await getTagBySlug(slug);
    if (tagAlreadyExists) {
        slug = generateSlug(name, true);
    }

    tag.name = name;
    tag.slug = slug;
    await tag.save();

    return res.json(tag);
};

export const deleteTagController = async (req: Request, res: Response): Promise<any> => {

    const schema = z.object({
        id: z.number()
    });

    const schemaValidator = schema.safeParse(req.body);

    if (!schemaValidator.success) {
        return res.status(400).json({
            message: "Invalid data",
            errors: schemaValidator.error,
        });
    }

    const { id } = req.body;
    const tag = await getTagById(id);

    if (!tag) {
        return res.status(404).json({ message: "Tag not found" });
    }

    await deletePostTagRelations({ tagId: id });

    await deleteTag(id);

    return res.json(tag);
}

export const getPostTagsController = async (req: Request, res: Response): Promise<any> => {
    const postId = parseInt(req.params.postId);

    if (!postId) {
        return res.status(400).json({ message: "Post id was not provided." });
    }

    const post = await getPostById(postId);

    if (!post) {
        return res.status(404).json({ message: "Post not found." });
    }

    const postTags = await getPostTags(postId);

    return res.json(postTags);
}

export const getTagBySlugController = async (req: Request, res: Response): Promise<any> => {
    const { slug } = req.params;

    const tag = await getTagBySlug(slug);

    if (!tag) {
        return res.status(404).json({ message: "Tag not found." });
    }

    return res.json(tag);
}