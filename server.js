// a condition to use env for development and not production
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
var cookieParser = require('cookie-parser')

const cors = require("cors");
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const app = express()
// const passport = require("passport")

// parse cookies
// we need this because "cookie" is true in csrfProtection
app.use(cookieParser())



app.set('view engine', 'ejs' )
app.set('views', __dirname + '/views' )
app.set('layout', 'layouts/layout')


app.use(cors());
app.use(expressLayouts)
app.use(express.static('public'))
app.use(methodOverride('_method'))

// app.use(bodyParser.urlencoded({ limit: '10mb', extended: false}))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true}))
// extended: true to allow json object and strings

// app.use(passport.initialize())
// require('./middlewares/passport')(passport)

// connecting to mongodb
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true, useUnifiedTopology: true})



// connection check
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

// using routers
// const indexRouter = require('./routes/index')
// const authorRouter = require('./routes/authors')
// const bookRouter = require('./routes/books')
app.use('/', require('./routes/first'))

app.use('/index', require('./routes/index'))
app.use('/authors', require('./routes/authors'))
app.use('/books', require('./routes/books'))

// test
app.use('/api/users', require('./routes/users'))
app.use('/api/admin', require('./routes/admin'))
// app.use('/api/superadmin', require('./routes/superadmin'))

app.listen(process.env.PORT || 3000)