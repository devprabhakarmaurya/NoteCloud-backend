const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const verifytoken = require('../middleware/verifytoken');

//ROUTE 1: Create a user with post that doesn't require auth POST- "/api/auth/createuser" No login required
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
            res.json({ message: 'User created successfully', token });
        }
        else {
            return res.status(400).json({ error: "Sorry user exists with this email" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }


})
//ROUTE 2:  Authenticate the user with POST "/api/auth/login" No login required
router.post('/login', [
    body("email").notEmpty().isEmail().withMessage("Please enter valid email"),
    body("password").notEmpty().withMessage("Password should not be blank"),

], async (req, res) => {
    let success = false;
    // errs in validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //destructuring req.body 
    const { email, password } = req.body;
    try {
        let user = await User.findOne({email})
        if(user){
            //comparing given password with user's password
            const passwordCompare = await bcrypt.compare(password , user.password);
            if(passwordCompare){
                //Generating auth token 
                const token = jwt.sign({user: user._id}, process.env.JWT_SIGN)
                //sending token as response
                success = true;
                res.json({success, message: 'User Login Successfuly', token });
            }
            else{
                // Bad request with error when password is wrong
                success = false;
                return res.status(400).json({success, message: "Invalid Credential" });
            }
        }
        else{
             // Bad request with error when email is wrong
             success = false;
            return res.status(400).json({success, message: "Invalid Credential" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})

//ROUTE 3: Get User data with POST "/api/auth/getuser" Login Required
router.post("/getuser", verifytoken , async (req,res)=>{   //verifytoken is the middleware
     const userId = req.user;                              // req.user came from middleware verifytoken which have id of user 
    try {
        // finding by id and select all the creds without password
        const user = await User.findById(userId).select('-password');
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})
module.exports = router;