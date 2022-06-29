const router = require("express").Router();
const User = require("../models/User")

const { userRegister, userLogin } = require('../utils/Auth');



// Homepage
router.get('/', async (req, res) => {
    res.send('Welcome to the User page')
})

// form
router.get('/register-user', async (req, res) => {
    res.render('auth-test-user/new', {
        // for populating data at catch
        user: new User()
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
router.get('/login-user', async (req, res) => {
    res.render('auth-test-user/login', {
        // for populating data at catch
        user: new User()
    })
})

// Login
router.post("/login-user", async (req, res) => {
    // for populating data at catch
    user = new User({
        username: req.body.username
        })
    await userLogin(req.body, "user", res);
});

// router.get("/profile", async (req, res) => {
//     return res.json("Hello World")
   

// })

module.exports = router;