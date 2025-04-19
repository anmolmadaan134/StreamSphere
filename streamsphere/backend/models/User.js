const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type:String,
        required:true,
        unique:true,
        trim:true,
        minlength:3
    },
    email: {
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    password: {
        type:String,
        required:true,
        minlength:6
    },
    profilePicture: {
        type:String,
        default:''
    },
    // subscribers: {
    //     type:Number,
    //     default:[]
    // },
    isAdmin: {
        type:Boolean,
        default:false
    }

},{
    timestamps:true
})

module.exports = mongoose.model('User', userSchema);

