const express= require('express')
const router = express.Router()
const Book = require('../models/books')

// for users and admin view
const { requireAuth, checkUser } = require('../middlewares/authMiddleware');

// for admin features only
const { requireAuthAdmin } = require('../middlewares/authMiddleware2')

router.get('*', checkUser);

router.get('/', requireAuthAdmin, async (req, res) => {
    // res.send("Hello World")
    let books
    try {
        books = await Book.find().sort({ createdAt : 'desc' }).limit(10).exec()
    } catch {
        books = []
        // sending empty array for error
    }
    res.render('indexAdmin', { books: books})
    // prepared books as a local/var to be used by view

})

router.get('/byuser', requireAuth, async (req, res) => {
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