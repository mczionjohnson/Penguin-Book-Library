const router = require("express").Router();

const { userRegister } = require('../utils/Auth');

// registration

router.get('/', async (req, res) => {

    res.send('Welcome to the Admin page')
})

router.get('/register-admin', async (req, res) => {

    res.render('auth-test-admin/new')
})

router.post('/', async (req, res) => {
    await userRegister(req.body, "admin", res);
})


// // Login
// router.get("/login-user", async (req, res) => {
//     try {

//     } catch {

//     }
// });
// router.get("/login-admin", async (req, res) => {
//     try {

//     } catch {

//     }
// });
// router.get("/login-super-admin", async (req, res) => {
//     try {

//     } catch {

//     }
// });


// // Authetication Protected

// router.get('/profile', async (req, res) => {

// }
// )
// router.get('/user-protected', async (req, res) => {
//     try {

//     } catch {

//     }
// });

// router.get('/admin-protected', async (req, res) => {
//     try {

//     } catch {

//     }
//     });

// router.get('/super-admin-protected', async (req, res) => {
//     try {

//     } catch {

//     }
// });






module.exports = router;