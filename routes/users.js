var csrf = require('csurf')
const bodyParser = require('body-parser')

const router = require("express").Router();
const User = require("../models/User")

// setup route middlewares
var csrfProtection = csrf({ cookie: true })
var parseForm = bodyParser.urlencoded({ extended: false })

const { userRegister, userLogin } = require('../utils/Auth');

router.get('/form', csrfProtection, function (req, res) {
    // pass the csrfToken to the view
    // res.render('auth-test-user/send', { csrfToken: req.csrfToken() })
    res.send(`${req.csrfToken()}`)

  })
   
router.post('/process', parseForm, csrfProtection, function (req, res) {
    res.send('data is being processed')
})

// Homepage
router.get('/', async (req, res) => {
    res.send('Welcome to the User page')
})

// form
router.get('/register-user', async (req, res) => {
    res.render('auth-test-user/new', {
        // for populating data at catch
        user: new User(),
        // csrfToken: req.csrfToken()
    })
})

// registration
router.post('/', async (req, res) => {
    // for populating data at catch
    user = new User({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email
    })
    await userRegister(req.body, "user", res);
})



// form
router.get('/login-user', csrfProtection, async (req, res) => {
    res.render('auth-test-user/login', {
        // for populating data at catch
        user: new User(),
        csrfToken: req.csrfToken()
    })
})

// Login
router.post("/login-user", parseForm, csrfProtection, async (req, res) => {
    // for populating data at catch
    user = new User({
        username: req.body.username,
        });
    csrfToken = req.csrfToken()
    await userLogin(req.body, "user", res);
});

// router.get("/profile", async (req, res) => {
//     return res.json("Hello World")
   

// })

module.exports = router;