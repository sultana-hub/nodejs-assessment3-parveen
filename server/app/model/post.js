const mongoose = require('mongoose')
const Schema = mongoose.Schema


const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    text: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    likes: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'user'
            }
        }
    ],
    unlikes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId, ref: 'user'
            }
        }
    ],
    comments: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        text: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    date: {
        type: Date,
        default: Date.now
    }


})

const PostModel = mongoose.model('post', PostSchema)

module.exports = PostModel