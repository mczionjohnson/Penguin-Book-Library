const { Schema, model } = require("mongoose");

const { isEmail } = require('validator')

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please input a username']
    },
    email: {
        type: String,
        required: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin", "superadmin"]
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: [true, "provide a password"],
        minlength: [8, 'minimum of 8 characters']
    }

}, {timestamps: true }
);

module.exports = model("Users", UserSchema );