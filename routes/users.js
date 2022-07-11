var csrf = require('csurf')
const bodyParser = require('body-parser')

const router = require("express").Router();
const User = require("../models/User")

// setup route middlewares
var csrfProtection = csrf({ cookie: { maxAge: 3000, httpOnly: true }})
// var csrfProtection = csrf({ cookie: { maxAge: 3000, httpOnly: true, secure: true, proxy: true}})
var parseForm = bodyParser.urlencoded({ extended: false })

const { userRegister, userLogin } = require('../utils/Auth');

// test
// router.get('/form', csrfProtection, function (req, res) {
//     // pass the csrfToken to the view
//     // res.render('auth-test-user/send', { csrfToken: req.csrfToken() })
//     res.send(`${req.csrfToken()}`)

//   })
   
// router.post('/process', parseForm, csrfProtection, function (req, res) {
//     res.send('data is being processed')
// })


// form
router.get('/signup', csrfProtection, async (req, res) => {
    res.render('auth-test-user/new', {
        // for populating data at catch
        user: new User(),
        csrfToken: req.csrfToken()
    })
})

// registration
router.post('/signup', parseForm, csrfProtection, async (req, res) => {
    // for populating data at catch
    user = new User({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email
    });
    csrfToken = req.csrfToken();
    await userRegister(req.body, "user", res);
})



// form
router.get('/login', csrfProtection, async (req, res) => {
    res.render('auth-test-user/login', {
        // for populating data at catch
        user: new User(),
        csrfToken: req.csrfToken()
    })
})

// Login
router.post("/login", parseForm, csrfProtection, async (req, res) => {
    // for populating data at catch
    user = new User({
        username: req.body.username,
        });
    csrfToken = req.csrfToken();
    await userLogin(req.body, "user", res);
});

router.get('/logout', async (req, res) => {
    await res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/')
})

   

module.exports = router;