const express = require('express')
const router = express.Router()
const articlesController = require('../controllers/articles.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.get('/articles', authMiddleware.isNotAuthenticated, articlesController.list)
router.post('/articles', authMiddleware.isAuthenticated, articlesController.create)
router.get('/articles/:id', authMiddleware.isNotAuthenticated, articlesController.get)
router.patch('/articles/:id', authMiddleware.isAuthenticated, articlesController.update)
router.delete('/articles/:id', authMiddleware.isAuthenticated, articlesController.delete)



module.exports = router

