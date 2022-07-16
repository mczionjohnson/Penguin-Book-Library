const mongoose = require('mongoose')
const Book = require('./books')

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})



module.exports = mongoose.model ('Author', authorSchema)
// create table called Author with the schema
// export the Author table for use in route

