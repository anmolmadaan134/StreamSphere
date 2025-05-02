const mongoose = require('mongoose')
const Schema = mongoose.Schema();

const CommentSchema = new Schema({
    content:{
        type:String,
        required:true,
        trim:true,
        maxlength:1000
    },

    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    video:{
        type:Schema.Types.ObjectId,
        ref:'Video',
        required:true
    },
    likes:[{
        type:Schema.Types.ObjectId,
        ref:'User'
    }],
    dislikes:[{
        type:Schema.Types.ObjectId,
        ref:'User'
    }],
    replies:[{
        type:Schema.Types.ObjectId,
        ref:'Comment',
    }],
    parentComment:{
        type:Schema.Types.ObjectId,
        ref:'Comment',
        default:null
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    },

})

// Update the updatedAt field on save
CommentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
  });
  
module.exports = mongoose.model('Comment', CommentSchema);