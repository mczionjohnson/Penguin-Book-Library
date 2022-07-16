const jwt = require("jsonwebtoken");

// const { SECRETADMIN } = require("../config/indexAdmin");
const SECRETADMIN = process.env.APP_SECRETADMIN



const requireAuthAdmin = (req, res, next) => {

    // because of cookie-parser and we named it 'jwt'
    const token = req.cookies.jwt
    // check
    if (token) {
        // SECRET is stored in .env
        jwt.verify(token, SECRETADMIN, (err, decodedToken) => {
            if (err) {
                res.redirect('/api/admin/login')
            } else {
                
                // calling next since the check is successful
                next();
            }
        })
    }
    else {
        res.redirect('/api/admin/login')
    }
}



module.exports = { requireAuthAdmin };