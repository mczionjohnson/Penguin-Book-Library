const express= require('express')
const router = express.Router()
const Book = require('../models/books')

router.get('/', async (req, res) => {
    // res.send("Hello World")
    let books
    try {
        books = await Book.find().sort({ createdAt : 'desc' }).limit(10).exec()
    } catch {
        books = []
        // sending empty array for error
    }
    res.render('index', { books: books})
    // prepared books as a local/var to be used by view

})


module.exports = router