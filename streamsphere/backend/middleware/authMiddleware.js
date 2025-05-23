const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = async(req,res,next)=>{
    let token;

    //Check if token exist in headers

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try{
            token = req.headers.authorization.split(' ')[1];
            console.log(token);
            

            const decoded = jwt.verify(token,process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password')

            next();
        }catch (error) {
            console.error(error);
            res.status(401).json({
              success: false,
              message: 'Not authorized, token failed'
            });
          }

    }

    
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Not authorized, no token'
      });
    }


}

module.exports = {protect}