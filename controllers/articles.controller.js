const Article = require('../models/article.model')
const createError = require('http-errors')
const mongoose = require('mongoose')

module.exports.list = (req, res, next) => {
    Article.find()
        .then(
            articles => res.status(200).json(articles)
        )
        .catch(next)
}

module.exports.get = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw createError('404', 'invalid Id')
    }
    Article.findById(req.params.id)
        .then(
            article => {
                if (!article) {
                    throw createError('404', 'Article not found')
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
        date: req.body.date
    })

    article.save()
        .then(
            article => res.status(201).json(article)
        )
        .catch(next)
}

module.exports.update = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw createError('404', 'invalid Id')
    }
    Article.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(
            article => {
                if (!article) {
                    throw createError('404', 'Article not found')
                }
                res.status(200).json(article)
            }
        )
        .catch(next)
}

module.exports.delete = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw createError('404', 'invalid Id')
    }
    Article.findByIdAndDelete(req.params.id)
        .then(
            article => {
                if (!article) {
                    throw createError('404', 'Article not found')
                }
                res.status(204).json()
            }
        )
        .catch(next)
}