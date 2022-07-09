const bcrypt = require("bcryptjs")
// const passport = require("passport")
const jwt = require("jsonwebtoken");

const User = require("../models/User")

// const { SECRET } = require("../config/index");
const SECRET = process.env.APP_SECRET



/*
* desc: register user (admin, user, super-admin)
* userDets is from the req.body
*/

const userRegister = async (userDets, role, res) => {
    try {
        let usernameNotTaken = await (validateUsername(userDets.username));
        if (!usernameNotTaken) {
            return res.status(400).render ('auth-test-user/new', {
                user: user,
                // populating data back for the get request
                errorMessage: `Username is already taken.`
            })
            // return res.status(400).send({
            //     message: `Username is already taken.`,
            //     success: false
            // })
        }

        let emailNotRegistered = await (validateEmail(userDets.email));
        if (!emailNotRegistered) {
            return res.status(400).render ('auth-test-user/new', {
                // populating data back for the get request
                user: user,
                csrfToken: csrfToken, 
                errorMessage: `Email is already registered.`
            })
            // return res.status(400).send({
            //     message: `Email is already registered.`,
            //     success: false
            // })
        }

        // hash the password with 12 salt rounds
        if(userDets.password.length < 8) {
            // res.status(400);
            // throw new Error('Password must be at least 8 characters long');
            return res.status(400).render ('auth-test-user/new', {
                // populating data back for the get request
                user: user,
                csrfToken: csrfToken, 
                errorMessage: `Password must be at least 8 characters long.`
            })
            }

        const password = await bcrypt.hash(userDets.password, 12);

        const newUser = new User({
            ...userDets,
            password,
            role
        });
        // using spread function ...userDets to store values
        await newUser.save();

        // return res.status(201).send({
        //     message: "Hurray! now you are successfully registered, Please Log in",
        //     success: true
        // })

        // res.send(`${userDets.name} is now a ${role}`)
        return res.render('auth-test-user/login', {
            // populating data back for the get request
            user: user,
            csrfToken: csrfToken, 
            errorMessage: `Welcome, You can now log in`
        })

    } catch {
        // res.redirect('/')
        // console.log(err.message, err.code)
        res.render('auth-test-user/new', {
            // populating data back for the get request
            user: user,
            csrfToken: csrfToken, 
            errorMessage: `Error creating an account`
        })
    }
};

const userLogin = async (userCreds, role, res) => {
    try {
    let { username, password } = userCreds;
    const userInput = await User.findOne({ username });
    // check username
    if (!userInput) {
        // res.status(404).json({
        //     message: "Username is not found. Invalid Login credentials.",
        //     success: false
        return res.status(404).render('auth-test-user/login', {
            user: user,
            csrfToken: csrfToken, 
            errorMessage: "Username is not found. Invalid Login credentials."
        });
    }
    // check role
    if (userInput.role != role) {
        // return res.status(403).json({
        //     message: "Please make sure you are loggin in from the right portal.",
        //     success: false
        // });
        return res.status(404).render('auth-test-user/login', {
            user: user,
            csrfToken: csrfToken, 
            errorMessage: "Please make sure you are loggin in from the right portal."
        });
    }
    // compare password
    let isMatch = await bcrypt.compare(password, userInput.password);

    if (isMatch) {
    const tokenAge = 3 * 24 * 60 * 60;
        // tokenAge in seconds 3d 24h 60min 60sec

        // a function to create token for user
        // returns a token with signature with payload and automatic headers
        
        const setToken = await token(userInput._id, userInput.role, userInput.username, userInput.email)
        res.cookie('jwt', setToken, { httpOnly: true, maxAge: tokenAge * 1000 });

        // let token = () => { 
        //     return jwt.sign ({
        //     user_id: userInput._id, 
        //     role: userInput.role, 
        //     username: userInput.username,
        //     email: userInput.email
        //     },
        //     SECRET, { expiresIn: tokenAge }
            // SECRET, { expiresIn: "7 days" } jwt[options]
            // token will expire in seven days
            // wrapped a secret into the token
            // );
        // }
        // tokenAge * 1000 to convert 3 days to milliseconds
        // res.cookie('jwt', token, { httpOnly: true, maxAge: tokenAge * 1000 });
        
        // let result= {
        //     username: userInput.username,
        //     role: userInput.role, 
        //     email: userInput.email,
        //     token: `Bearer ${token}`,
        //     expiresIn: 168
        // };
        
        // return res.status(200).json({
        //     ...result,
        //     message: "Hurray! You are now logged in",
        //     success: true
        // })
           
        // return res.status(200).json({
        //     // user_id: userInput._id,
        //     setToken
        // });
        return res.redirect('/index/byuser')

    } else {
        // return res.status(403).json({
        //     message: "Incorrect password.",
        //     success: false
        // });
        return res.status(404).render('auth-test-user/login', {
            user: user,
            csrfToken: csrfToken, 
            errorMessage: "Incorrect password."
        });
    }} catch {
        // return res.status(403).json({
        //     message: "Incorrect password.",
        //     success: false
        // });
        // console.log(err);
        res.redirect('/')
    }

}


// const userAuth = passport.authenticate('jwt', { session: false })



// a function to create token for user
// returns a token with signature with payload and automatic headers
let token = async (user_id, role, username, email) => { 
    const tokenAge = 3 * 24 * 60 * 60;
    // tokenAge in seconds 3d 24h 60min 60sec
    return await jwt.sign ({
    user_id, 
    role, 
    username,
    email
    },
    SECRET, { expiresIn: tokenAge }
    // SECRET, { expiresIn: "7 days" } jwt[options]
    // token will expire in seven days
    // wrapped a secret into the token
    );
}
// tokenAge * 1000 to convert 3 days to milliseconds
// res.cookie('jwt', token, { httpOnly: true, maxAge: tokenAge * 1000 });


const validateUsername = async username => {
    let user = await User.findOne({ username });
    return user ? false : true;
    // ternary function
    // if (user) {
    //     return false
    // } else {
    //     return true
    // }
};

const validateEmail = async email => {
    let user = await User.findOne({ email });
    return user ? false : true;
};

module.exports = {
    // userAuth,
    userLogin,
    userRegister
}