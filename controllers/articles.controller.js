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
    const last = req.params.last
    console.info(last)
    if (last || last !== undefined) {
        Article.find(criteria).limit(5)
            .sort({ createdAt: -1 })
            .limit(100)
            .populate('user')
            .then(article => {
                res.status(200).json(article)
            })
            .catch(next)
    }
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


// module.exports.upload = (req, res, next) => {
//     // Configurar el modulo connect multiparty router/article.js (hecho)

//     // Recoger el fichero de la petición
//     const file_name = 'File not found';

//     if (!req.files) {
//         return res.status(404).send({
//             status: 'error',
//             message: file_name
//         });
//     }

//     // Conseguir nombre y la extensión del archivo
//     const file_path = req.files.file0.path;
//     const file_split = file_path.split('/');

//     // Nombre del archivo
//     const file_name = file_split[2];

//     // Extensión del fichero
//     const extension_split = file_name.split('/.');
//     const file_ext = extension_split[1];

//     // Comprobar la extension, solo imagenes, si es valida borrar el fichero
//     if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {

//         // borrar el archivo subido
//         fs.unlink(file_path, (err) => {
//             return res.status(200).send({
//                 status: 'error',
//                 message: 'La extensión de la imagen no es válida !!!'
//             });
//         });

//     } else {
//         // Si todo es valido, sacando id de la url
//         const articleId = req.params.id;

//         if (articleId) {
//             // Buscar el articulo, asignarle el nombre de la imagen y actualizarlo
//             Article.findOneAndUpdate({ id: articleId }, { image: file_name }, { new: true }, (err, articleUpdated) => {

//                 if (err || !articleUpdated) {
//                     return res.status(200).send({
//                         status: 'error',
//                         message: 'Error al guardar la imagen de articulo !!!'
//                     });
//                 }

//                 return res.status(200).send({
//                     status: 'success',
//                     article: articleUpdated
//                 });
//             });
//         } else {
//             return res.status(200).send({
//                 status: 'success',
//                 image: file_name
//             });
//         }

//     }
// }, // end upload file

//     module.exports.getImage = (req, res, next) => {
//         const file = req.params.image;
//         const path_file = './upload/articles/' + file;

//         fs.exists(path_file, (exists) => {
//             if (exists) {
//                 return res.sendFile(path.resolve(path_file));
//             } else {
//                 return res.status(404).send({
//                     status: 'error',
//                     message: 'La imagen no existe !!!'
//                 });
//             }
//         });
//     },

module.exports.search = (req, res) => {
    // Sacar el string a buscar
    const searchString = req.params.search;

    // Find or
    Article.find({
        "$or": [
            { "title": { "$regex": searchString, "$options": "i" } },
            { "content": { "$regex": searchString, "$options": "i" } }
        ]
    })
        .sort([['date', 'descending']])
        .exec((err, articles) => {

            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la petición !!!'
                });
            }

            if (!articles || articles.length <= 0) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos que coincidan con tu busqueda !!!'
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });

        });
}