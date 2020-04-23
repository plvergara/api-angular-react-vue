const mongoose = require('mongoose')
require('../models/comment.model')
const Schema = mongoose.Schema

const articleSchema = Schema(
    {
        title: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            default: Date.now
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        image: {
            type: String
        }
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                ret.id = doc._id;
                delete ret._id;
                delete ret.__v;
                return ret;
            }
        }
    }

)

articleSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'article',
    justOne: false,
})

const Article = mongoose.model('Article', articleSchema)
module.exports = Article