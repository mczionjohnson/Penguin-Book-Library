const mongoose = require('mongoose')
const path = require('path')

const coverImageBasePath = 'uploads/bookCovers'
// multer will create this in the public folder automatically for us

const bookSchema = new mongoose.Schema ({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    publishDate: {
        type: Date,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImageName: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
    }
})
// mongoose.Schema.Types.ObjectId tells model that author is another table in the collection
// the ref states the table

// a virtual object since we have a string here and we want to get the actual cover 
// in the public file and render to the client
bookSchema.virtual('coverImagePath').get(function() {
    if (this.coverImageName != null) {
        return path.join('/', coverImageBasePath, this.coverImageName)
        // the index path, the folders and the name of this file
    }
})

module.exports = mongoose.model ('Book', bookSchema)

// exporting the path as a var and not as a default
module.exports.coverImageBasePath = coverImageBasePath