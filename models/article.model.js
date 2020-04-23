const mongoose = require('mongoose')
const Schema = mongoose.Schema

const articleSchema = Schema(
    {
        title: String,
        body: String,
        date: {
            type: Date,
            daefault: Date.now
        },
        image: String
    },
    {
        timestamps: true,
        toJSON: {
            transform: (doc, ret) => {
                ret.id = doc._id;
                delete ret._id;
                delete ret.__v;
                return ret;
            }
        }
    }
)

const Article = mongoose.model('Article', articleSchema)
module.exports = Article