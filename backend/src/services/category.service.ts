import Category from "../models/category";

export async function getAllCategories(filters?: { userId?: number }) {

    const where: any = {};

    if (filters && filters.userId) {
        where.userId = filters.userId;
    }

    const categories = await Category.findAll({
        where,
        order: [
            ['id', 'DESC']
        ]
    });

    return categories;
}

export async function getAllCategoriesPaginated(filters?: {
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

    const result = await Category.findAndCountAll({
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


export async function addCategory(name: string, slug: string, userId: number) {
    const category = new Category();
    category.name = name;
    category.userId = userId;
    category.slug = slug;

    await category.save();
    return category;

}

export async function getCategoryBySlug(slug: string) {
    const category = await Category.findOne({
        where: {
            slug
        }
    });
    return category;
}

export async function updateCategory(name: string, slug: string, id: number) {
    const category = await Category.findByPk(id);
    if (!category) {
        throw new Error('Category not found');
    }
    if (name) category.name = name;
    if (slug) category.slug = slug;

    await category.save();

    return category;
}

export async function getCategoryById(id: number) {
    const category = await Category.findByPk(id);
    return category;
}

export async function deleteCategory(id: number) {
    const category = await Category.findByPk(id);
    if (!category) {
        throw new Error('Category not found');
    }

    await category.destroy();
    return category;

}

