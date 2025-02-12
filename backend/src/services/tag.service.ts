import { Tag } from "../models/tag"


export const getAllTags = (filters?: { userId?: number }) => {
    const where: any = {};

    if (filters && filters.userId) {
        where.userId = filters.userId;
    }

    return Tag.findAll({
        order: [
            ['createdAt', 'DESC']
        ],
        where
    });
}

export async function getAllTagsPaginated(filters?: {
    userId?: number,
    limit?: number,
    offset?: number,
    sortField?: string,
    sortOrder?: 'ASC' | 'DESC',
    filters?: Record<string, any>
}) {
    const where: any = {};

    if (filters && filters.userId) {
        where.userId = filters.userId;
    }

    //we add dynamic filters if any
    if (filters?.filters) {
        Object.assign(filters, filters.filters);
    }

    const { limit, offset, sortField = 'id', sortOrder = 'DESC' } = filters || {};

    const result = await Tag.findAndCountAll({
        where,
        order: [[sortField, sortOrder]],
        limit,
        offset
    });

    return {
        partialElements: result.rows,
        total: result.count
    };

}

export const addTag = (name: string, slug: string, userId: number) => {
    const tag = new Tag();
    tag.name = name;
    tag.userId = userId;
    tag.slug = slug;

    return tag.save();
}

export const getTagBySlug = (slug: string) => {
    return Tag.findOne({
        where: {
            slug
        }
    });
}

export const getTagById = (id: number) => {
    return Tag.findByPk(id);
}

export const deleteTag = (id: number) => {
    return Tag.destroy({
        where: {
            id
        }
    });
}

export const getTagsByIds = (ids: number[]) => {
    return Tag.findAll({
        where: {
            id: ids
        }
    });
}