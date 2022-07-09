const express= require('express')
const router = express.Router()
// const Book = require('../models/books')

router.get('/', async (req, res) => {
    // res.send("Hello World")

    res.render('first')
})

module.exports = router