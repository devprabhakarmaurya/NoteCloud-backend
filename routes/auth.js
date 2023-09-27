const express = require('express');
const router = express.Router();
const User = require('../models/User');

//CReate a user with post that doesn't require auth
router.post('/',(req, res)=>{
    console.log(req.body);
    const user = User(req.body);
    user.save();
    res.send(req.body);

})
module.exports = router;