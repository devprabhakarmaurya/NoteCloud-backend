const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifytoken= (req,res,next)=>{
    const token  = req.header('token')
    if(!token){
        return res.status(401).send({message:'No Token Provided'})
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SIGN);
        req.user = data.user;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).send({message:'No Token Provided'})
    }
   
}
module.exports = verifytoken ; 