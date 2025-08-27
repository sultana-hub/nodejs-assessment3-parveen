const mongoose = require('mongoose')

const schema = mongoose.Schema


const BlogSchema = new schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        }, // link to teacher
    },
    { timestamps: true }
)

const BlogModel = mongoose.model('blog', BlogSchema)

module.exports = BlogModel