const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const videoSchema = new Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        trim:true
    },
    url:{
        type:String,
        required:true
    },
    thumbnailUrl:{
        type:String,
    },
    publicId:{
        type:String,
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    views:{
        type:Number,
        default:0,
        min:0
    },
    likes:{
        type:Number,
        default:0,
        min:0
    },
    dislikes:{
        type:Number,
        default:0,
        min:0
    },
    tags:[{
        type:String,
        trim:true,
        maxlength:20
    }],
    duration: {
        type: Number
      },
      format: {
        type: String,
        enum: ['mp4', 'avi', 'mov', 'mkv', 'webm']
      },
      metadata:{
        resolution:{
            width:Number,
            height:Number,
        },
        fileSize:{
            type:Number,
            min:0
        }
      },
      privacy:{
        type:String,
        enum:['public','private','unlisted'],
        default:'public'
      },
      processingStatus:{
        type:String,
        enum:['pending','processing','completed','failed'],
        default:'pending'
      },
      processingError:String,
      processedUrl:String,
      resolutions: [{
        resolution: String,
        url: String,
        publicId: String
    }],
      likes_details:[{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        createdAt:{
            type:Date,
            default:Date.now()
        }
      }],
      comments_count:{
        type:Number,
        default:0,
        min:0
      }

},{
    timestamps:true
})

videoSchema.index({ owner: 1, createdAt: -1 });
videoSchema.index({ tags: 1 });
videoSchema.index({ views: -1 });
module.exports = mongoose.model('Video',videoSchema)