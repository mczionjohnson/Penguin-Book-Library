const express= require('express')

const router = express.Router()

// import the Author and Book Tables and allow it as an object
const Author = require('../models/authors')
const Book = require('../models/books')

// const uploadPath = path.join('public', Book.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

// const upload = multer({
//     dest: uploadPath,
//     fileFilter: (req, file, callback) => {
//         callback(null, imageMimeTypes.includes(file.mimetype))
//     }
// })

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
router.post('/', async (req, res) => {
    // const fileName = req.file != null ? req.file.filename : null
    // res.send('Create book')
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate), 
        pageCount: req.body.pageCount,
        // coverImageName: fileName,
        description: req.body.description
    })
    // converts the publishDate back to date before inserting in the Db

    try {
        saveCover(book, req.body.cover)
        // grabbing the cover data in views by the name on the input
        // coverImage: and coverImageType: already saved by the saveCover function
        const newBook = await book.save()
        res.redirect(`books/${newBook.id}`)
        // res.redirect('books')
    } catch {
        // if (book.coverImageName != null) {
        //     removeBookCover(book.coverImageName)
        renderNewPage(res, book, true)
    }
})

// Show Book Route
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('author').exec()
        res.render('books/show', { book: book })
    } catch {
        res.redirect('/')
    }
})


// Edit Book Route
router.get('/:id/edit', async (req, res) => {
    const book = await Book.findById(req.params.id)
    try {
        renderEditPage(res, book)
    } catch {
        res.redirect('/')
    }
})

// Update book
router.put('/:id', async (req, res) => {
    let book
    try{
        book = await Book.findById(req.params.id)
        book.title =  req.body.title
        book.author =  req.body.author
        book.publishDate =  new Date(req.body.publishDate)
        // converts it back to date string
        book.pageCount =  req.body.pageCount
        book.description =  req.body.description
        if (req.params.cover != null && req.params.cover != ''){
            saveCover(book, req.body.cover)
        }
        await book.save()
        res.redirect(`/books/${book.id}`)
    } catch {
        if (book != null) {
            renderEditPage(res, book, true)
        } else {
            redirect('/')
        }
    }
})

// Delete Route
router.delete('/:id', async (req, res) => {
    let book
    try {
        book = await Book.findById(req.params.id)
        await book.remove()
        res.redirect('/books')
    } catch {
        if (book != null) {
            res.render('books/show', {
                book: book,
                errorMessage: 'Could not remove book'
            })
        } else {
            res.redirect('/')
        }
    }
})

// to remove the cover file if saved in public folder when there is an error
// function removeBookCover(fileName) {
//         fs.unlink(path.join(uploadPath, fileName), err => {
//             if (err) console.error(err)
//         })
// }

// creating a dynamic function to be used by multiple router
async function renderNewPage(res, book, hasError = false) {
    renderFormPage(res, book, 'new', hasError)
}
// authors, book and errorMessage are var made available locally

async function renderEditPage(res, book, hasError = false) {
    renderFormPage(res, book, 'edit', hasError)
}

// dynamic function
async function renderFormPage(res, book, form, hasError = false) {
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book: book
        }
        if (hasError) {
            if (form == 'edit') {
                params.errorMessage = 'Error Updating book'
            } else {
                params.errorMessage = 'Error Creating Book'
            }
        }
        res.render(`books/${form}`, params)
    } catch {
        res.redirect('/books')
    }
}


function saveCover(book, coverEncoded) {
    if (coverEncoded === null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, 'base64')
        book.coverImageType = cover.type
    }
}



module.exports = router