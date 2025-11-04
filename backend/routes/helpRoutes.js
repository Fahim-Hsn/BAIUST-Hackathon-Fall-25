import { Router } from 'express';
import { addHelpRequest, listHelpRequests } from '../controllers/helpController.js';

const router = Router();

router.post('/', addHelpRequest);
router.get('/', listHelpRequests);

export default router;


