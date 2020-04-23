const Article = require('../models/article.model')
const Comment = require('../models/comment.model')
const User = require('../models/user.model')
const createError = require('http-errors')
const mongoose = require('mongoose')

module.exports.list = (req, res, next) => {
    const criteria = req.query.search
        ? {
            body: new RegExp(req.query.search, 'i')
        }
        : {}

    Article.find(criteria)
        .sort({ createdAt: -1 })
        .limit(100)
        .populate('user')
        .then(article => {
            res.status(200).json(article)
        })
        .catch(next)
}

module.exports.get = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw createError(404, 'invalid Id')
    }
    Article.findById(req.params.id)
        .populate('user')
        .populate({
            path: 'comments',
            options: {
                sort: {
                    createdAt: -1
                }
            },
            populate: {
                path: 'user'
            }
        })
        .then(
            article => {
                if (!article) {
                    throw createError(404, 'Article not found')
                }
                res.status(200).json(article)
            }

        )
        .catch(next)
}

module.exports.create = (req, res, next) => {
    const article = new Article({
        title: req.body.title,
        body: req.body.body,
        image: req.body.image,
        user: req.currentUser.id,
        date: req.body.date
    })

    article.save()
        .then(
            article => res.status(201).json(article)
        )
        .catch(next)
}

module.exports.addComment = (req, res, next) => {
    const artId = req.params.id

    const comment = new Comment({
        text: req.body.text,
        user: req.currentUser.id,
        article: artId
    })

    comment.save()
        .then(comment => res.status(201).json(comment))
        .catch(next)
}

module.exports.update = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw createError(404, 'invalid Id')
    }
    Article.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(
            article => {
                if (!article) {
                    throw createError(404, 'Article not found')
                }
                res.status(200).json(article)
            }
        )
        .catch(next)
}

module.exports.delete = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw createError(404, 'invalid Id')
    }
    Article.findByIdAndDelete(req.params.id)
        .then(
            article => {
                if (!article) {
                    throw createError(404, 'Article not found')
                }
                res.status(204).json()
            }
        )
        .catch(next)
}

module.exports.profile = (req, res, next) => {
    User.findOne({ username: req.params.username })
        .populate({
            path: 'article',
            populate: {
                path: 'user'
            }
        })
        .then(user => {
            if (user) {
                res.status(201).json(user)
            } else {
                throw createError(404, 'user not found')
            }
        })
        .catch(next)
}