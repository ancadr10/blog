import express, { Router } from "express";
import { 
    getCategories,
    addCategoriesController, 
    updateCategoryController,
    deleteCategoryController,
    getCategoryBySlugController,
    getCategoriesPaginated
} from "../controllers/category.controller";
import { authenticateJWT, authenticateJWTOptional } from "../shared/auth.util";

const router: Router = express.Router();

router.get('/', authenticateJWTOptional, getCategories);
router.post('/categories-paginated', authenticateJWTOptional, getCategoriesPaginated);
router.post('/', authenticateJWT,  addCategoriesController);
router.put('/', authenticateJWT,  updateCategoryController);
router.delete('/', authenticateJWT,  deleteCategoryController);
router.get('/slug/:slug', getCategoryBySlugController);

export default router;