import { Router } from 'express';
import { getAllDiseases, getDiseaseById, getDiseasesBySeason, createDisease } from '../controllers/seasonalDiseaseController.js';

const router = Router();

router.get('/', getAllDiseases);
router.get('/season/:season', getDiseasesBySeason);
router.get('/:id', getDiseaseById);
router.post('/', createDisease);

export default router;

