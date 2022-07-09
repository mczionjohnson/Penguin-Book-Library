const jwt = require("jsonwebtoken");
const User = require("../models/User")


// const { SECRET } = require("../config/index");
const SECRET = process.env.APP_SECRET

// const { SECRETADMIN } = require("../config/indexAdmin");
const SECRETADMIN = process.env.APP_SECRETADMIN





// const requireAuth = (req, res, next) => {

//     // because of cookie-parser and we named it 'jwt'
//     const token = req.cookies.jwt
//     // check
//     if (token) {
//         // SECRET is stored in .env
//         jwt.verify(token, SECRET, (err, decodedToken) => {
//             if (err) {
//                 res.redirect('/api/users/login')
//             } else {
//                 // calling next since the check is successful
//                 next();
//             }
//         })
//     }
//     else {
//         res.redirect('/api/users/login')
//     }
// }

// module.exports = { requireAuth };


const requireAuth = (req, res, next) => {

    // because of cookie-parser and we named it 'jwt'
    const token = req.cookies.jwt
    
    // check
    if (token) {
        // SECRET is stored in .env
        jwt.verify(token, SECRET, (err, userToken) => {
            if (err) {
                jwt.verify(token, SECRETADMIN, (err, adminToken) => {
                    if (err) {
                        res.redirect('/')

                    } else {
                        next();
                    }
                })
            } else {
                // calling next since the check is successful
                next();
            }
        })
    }
    else {
        res.redirect('/api/users/login')
    }
}

// check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt
    
    // check
    if (token) {
        // SECRET is stored in .env
        // userToken or adminToken will carry the payload
        jwt.verify(token, SECRET, async (err, userToken) => {
            if (err) {
                jwt.verify(token, SECRETADMIN, async (err, adminToken) => {
                    if (err) {
                        res.locals.user = null;
                        next();

                    } else {
                        let { username } = adminToken
                        let user = await User.findOne({ username }); 
                        console.log(user)
                         res.locals.logged = user;

                        next();
                    }
                })
            } else {
                let { username } = userToken
                let user = await User.findOne({ username }); 
                // console.log(user)
                res.locals.logged = user;

                // calling next since the check is successful
                next();
            }
        })
    }
    else {
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuth, checkUser };
