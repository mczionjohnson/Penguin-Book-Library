const express= require('express')
const multer = require('multer')
const router = express.Router()
const path = require('path')
const fs = require('fs')

// import the Author and Book Tables and allow it as an object
const Author = require('../models/authors')
const Book = require('../models/books')

const uploadPath = path.join('public', Book.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})


// All Books
router.get('/', async (req, res) => {
    // res.send('All book')
    // preparing an array of book model to be used by view
    let query = Book.find()
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishDate', req.query.publishedBefore )
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishDate', req.query.publishedAfter )
    }
    try {
        const books = await query.exec()
        const params = {
            books: books,
            searchOptions: req.query
        } 
        res.render('books/index', params)
        // preparing a loop in Book to be used by the views
        // creating books and searchOIptions to used as locals/var by the views
    } catch {
        res.redirect('/')
    }
}) 

// New Book route
// pass in the var created at try or catch block after the path
router.get('/new', async (req, res) => {
    // res.send('New book')
    // res.render('books/new')
    renderNewPage(res, new Book())
})

// Create new book
router.post('/', upload.single('cover'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null
    // res.send('Create book')
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate), 
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        description: req.body.description
    })
    // converts the publishDate back to date before inserting in the Db
    try{
        const newBook = await book.save()
        // res.redirect('authors/${newBook.id}')
        res.redirect('books')
    } catch {
        if (book.coverImageName != null) {
            removeBookCover(book.coverImageName)
        }
        renderNewPage(res, book, true)
    }
})

// to remove the cover file if saved in public folder when there is an error
function removeBookCover(fileName) {
        fs.unlink(path.join(uploadPath, fileName), err => {
            if (err) console.error(err)
        })
}

// creating a dynamic function to be used by multiple router
async function renderNewPage(res, book, hasError = false) {
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book: book
        }
        if (hasError) params.errorMessage = 'Error Creating Book'
        res.render('books/new', params)
    } catch {
        res.redirect('/books')
    }
}
// authors, book and errorMessage are var made available locally

module.exports = router