import { Router } from 'express';
import { addMood, getMoodsByUser } from '../controllers/moodController.js';

const router = Router();

router.post('/', addMood);
router.get('/:userId', getMoodsByUser);

export default router;


