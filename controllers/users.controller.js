const User = require('../models/user.model')
const createError = require('http-errors')
const mongoose = require('mongoose')

module.exports.list = (req, res, next) => {
    User.find()
        .then(users => res.status(200).json(users))
        .catch(next)
}

module.exports.get = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw createError(404, 'invalid Id')
    }
    User.findById(req.params.id)
        .then(user => {
            if (!user) {
                throw createError(404, 'user not found')
            }
            res.status(201).json(user)
        })
}

module.exports.create = (req, res, next) => {
    const user = new User({
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        avatar: req.file ? req.file.url : undefined
    })

    user.save()
        .then((user) => res.status(201).json(user))
        .catch(next)
}
module.exports.update = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw createError(404, 'invalid Id')
    }
    User.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(
            user => {
                if (!user) {
                    throw createError(404, 'User not found')
                }
                res.status(200).json(user)
            }
        )
        .catch(next)
}

module.exports.login = (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw createError(400, 'missing credentials')
    }

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                throw createError(404, 'user not found')
            } else {
                return user.checkPassword(password)
                    .then(match => {
                        if (!match) {
                            throw createError(400, 'invalid password')
                        } else {
                            req.session.user = user
                            res.json(user)
                        }
                    })
            }
        })
        .catch(next)
}

module.exports.logout = (req, res) => {
    req.session.destroy()
    res.status(204).json()
}

module.exports.delete = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw createError(404, 'invalid Id')
    }
    User.findByIdAndDelete(req.params.id)
        .then(
            user => {
                if (!user) {
                    throw createError(404, 'User not found')
                }
                res.status(204).json()
            }
        )
        .catch(next)
}