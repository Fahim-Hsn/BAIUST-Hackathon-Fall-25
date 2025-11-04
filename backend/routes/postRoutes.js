import express from 'express'
import { getAllPosts, getPostById, getPostsByCategory, createPost } from '../controllers/postController.js'

const router = express.Router()

router.get('/', getAllPosts)
router.get('/category/:category', getPostsByCategory)
router.get('/:id', getPostById)
router.post('/', createPost)

export default router

