import { Router } from 'express';
import { register, login, recover, getProfile, updateProfile } from '../controllers/userController.js';

const router = Router();

router.post('/register', register);
router.get('/register', (_req, res) => res.status(405).json({ message: 'এই রুটে POST ব্যবহার করুন' }));
router.post('/login', login);
router.get('/login', (_req, res) => res.status(405).json({ message: 'এই রুটে POST ব্যবহার করুন' }));
router.post('/recover', recover);
router.get('/recover', (_req, res) => res.status(405).json({ message: 'এই রুটে POST ব্যবহার করুন' }));
// Only match valid Mongo ObjectId to avoid catching '/register' etc.
router.get('/:id([0-9a-fA-F]{24})', getProfile);
router.put('/:id([0-9a-fA-F]{24})', updateProfile);

export default router;


