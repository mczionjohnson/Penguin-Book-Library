const express= require('express')
const router = express.Router()

// import the Author Table and allow it as an object
const Author = require('../models/authors')
const Book = require('../models/books')

// All authors
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const authors = await Author.find(searchOptions)
        res.render('authors/index', { 
            authors: authors,
            searchOptions: req.query
        })
        // creating var/locals to be fetched by the views
        // creating a loop and result can be used in the views
    } catch {
        res.redirect('/')
    }
})

// New authors route
router.get('/new', async (req, res) => {
    res.render('authors/new', {
         author: new Author(),
        })
})

// Create new author
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    })
    // using async await
    try {
        const newAuthor = await author.save()
        res.redirect(`authors/${newAuthor.id}`)
    } catch {
        res.render('authors/new', {
        author: author,
        errorMessage: 'Error creating Author'
    })
    }
    // author.save((err, newAuthor) => {
    //     if (err) {
    //         res.render('authors/new', {
    //             author: author,
    //             errorMessage: 'Error creating Author'
    //         })
    //     } else {
    //         // res.redirect('authors/${newAuthor.id}')
    //         res.redirect('authors')

    //     }
    // })
})

router.get('/:id', async (req, res) => {
    // res.send('Show Author' + req.params.id)
    try {
        const author = await Author.findById(req.params.id)
        const books = await Book.find({ author : author.id }).limit(6).exec()
        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        })
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }

})

router.get('/:id/edit', async (req, res) => {
    // res.send('Edit Author' + req.params.id)  
    try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', {
            author: author
           })
    } catch {
        res.redirect('/authors')
    }

})

router.put('/:id', async (req, res) => {
    // res.send('Update Author' + req.params.id) 
    let author
    try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${author.id}`)
    } catch {
        if ( author == null) {
            res.redirect('/')
        } else {
            res.render('authors/edit', {
                author: author,
                errorMessage: 'Error updating Author'
            })
        }
    }
})

router.delete('/:id', async (req, res) => {
    // res.send('Delete Author' + req.params.id) 
    let author
    let books
    try {

        author = await Author.findById(req.params.id)
        books = await Book.find({ author : author.id })

        await author.remove()
        res.redirect('/authors')

    } catch {
        if ( author == null) 
        {
            res.redirect('/')
        } else {
        //     res.redirect(`/authors/${author.id}`)
        // }
            res.render('authors/show', {
                author: author,
                booksByAuthor: books,
                errorMessage: 'Author has one or more books registered'
            })
        }
    }
})

module.exports = router
