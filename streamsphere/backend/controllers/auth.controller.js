const User = require('../models/User')
const bcrypt = require('bcrypt')
const {generateToken} = require('../utils/jwtUtils')

exports.register = async(req,res)=>{
    try{
        const {username,email,password} = req.body;

        const existingUser = await User.findOne({ $or:[{email},{username}]});

        if(existingUser){
            return res.status(400).json({
                success:false,
                message:'User with this email or username already exists'
            })
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt)

        //Create a new user
        const newUser = new User({
            username,
            email,
            password:hashedPassword
        })

        const savedUser = await newUser.save()

        //Remove password
        const {password:_,...userData} = savedUser._doc;

        const token = generateToken(savedUser._id)

        res.status(201).json({
            success:true,
            data:userData,
            token
        })
    }catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        })
    }
}

//Login user
exports.login = async(req,res)=>{
    try{
        const {email,password} = req.body;

        const user = await User.findOne({email})

        //Check the password if it is correct and user exists or not.
        if(!user || !(await bcrypt.compare(password,user.password))){
            return res.status(401).json({
                success:false,
                message:'Invalid email or password'
            });
        }

        //Generate token
        const token = generateToken(user._id)


        const {password:_,...userData} = user._doc

        res.status(200).json({
            success: true,
            data: userData,
            token
          });

    }
    catch (error) {
        res.status(500).json({
          success: false,
          message: error.message
        });
      }
}