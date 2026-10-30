import { Router } from 'express';
import { postController } from '../controllers/postController.js';

const router = Router();

router.get('/', postController.getPosts);
router.get('/:id', postController.getPostById);
router.post('/', postController.createPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

router.post('/:id/like', postController.toggleLike);
router.post('/:id/comments', postController.addComment);
router.delete('/:id/comments/:commentId', postController.deleteComment);

export default router;
