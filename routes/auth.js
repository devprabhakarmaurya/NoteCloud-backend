const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

//Create a user with post that doesn't require auth api = "/api/auth/createuser"
router.post('/createuser', [
    body("name").isString().isLength({ min: 3 }).withMessage("Name should be atleast 3 Characters"),
    body("email").notEmpty().isEmail().withMessage("Please enter valid email"),
    body("password").isLength({ min: 5 }).withMessage("Password should be aleast 5 Characters long"),

], async (req, res) => {
    // errs in validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //destructuring req.body 
    const { name, email, password } = req.body;
    // Checking email exist already and then creating new user
    // Using await is neccessary so that it is promise 
    try {
        let user = await User.findOne({ email: email })
        if (!user) {
            user = new User({ name, email, password });
            await user.save();

            // Generate a JWT token
            const token = jwt.sign({user: user._id}, process.env.JWT_SIGN)
            res.json({ message: 'User created successfully', user, token });
        }
        else {
            return res.status(400).json({ error: "Sorry user exists with this email" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }


})
module.exports = router;