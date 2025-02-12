import express, { Router } from "express";
import { addTagController, deleteTagController, getTagBySlugController, getPostTagsController, getTagsController, updateTagController, getTagsPaginated } from "../controllers/tag.controller";
import { authenticateJWT, authenticateJWTOptional } from "../shared/auth.util";

const router: Router = Router();

router.get('/', authenticateJWTOptional, getTagsController);
router.post('/tags-paginated', authenticateJWTOptional, getTagsPaginated);
router.post('/', authenticateJWT, addTagController);
router.put('/', authenticateJWT, updateTagController);
router.delete('/', authenticateJWT, deleteTagController);
router.get('/getPostTagRelations/:postId', getPostTagsController);
router.get('/getTagBySlug/:slug', getTagBySlugController);

export default router;