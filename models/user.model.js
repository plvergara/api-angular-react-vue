const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10
const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
const Schema = mongoose.Schema

const userSchema = Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            minlength: [3, 'Name needs at last 8 chars'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [EMAIL_PATTERN, 'Email is invalid']
        },
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password needs at last 8 chars']
        },
        avatar: {
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

userSchema.virtual('articles', {
    ref: 'Article',
    localField: '_id',
    foreignField: 'user',
    justOne: false,
})

userSchema.pre('save', function (next) {
    const user = this

    if (user.isModified('password')) {
        bcrypt.genSalt(SALT_WORK_FACTOR)
            .then(salt => {
                return bcrypt.hash(user.password, salt)
                    .then(hash => {
                        user.password = hash
                        next()
                    })
            })
            .catch(next)
    } else {
        next()
    }
})

userSchema.methods.checkPassword = function (password) {
    return bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', userSchema)
module.exports = User