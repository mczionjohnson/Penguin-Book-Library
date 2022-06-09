const express= require('express')
const router = express.Router()

// import the Author Table and allow it as an object
const Author = require('../models/authors')

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
router.get('/new', (req, res) => {
    res.render('authors/new', {
         author: new Author() 
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
        // res.redirect('authors/${newAuthor.id}')
        res.redirect('authors')

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

module.exports = router