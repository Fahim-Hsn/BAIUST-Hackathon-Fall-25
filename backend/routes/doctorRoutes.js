import { Router } from 'express';
import { getAllDoctors, getDoctorById, getDoctorsBySpecialty, searchDoctors, createDoctor } from '../controllers/doctorController.js';

const router = Router();

router.get('/', getAllDoctors);
router.get('/search', searchDoctors);
router.get('/specialty/:specialty', getDoctorsBySpecialty);
router.get('/:id', getDoctorById);
router.post('/', createDoctor);

export default router;

