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
    },
    bannerImage: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: 1000,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  websiteUrl: {
    type: String,
    default: ''
  },
  socialLinks: {
    twitter: { type: String, default: '' },
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    tiktok: { type: String, default: '' }
  },
  subscribers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  subscribedTo: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  playlists: [{
    type: Schema.Types.ObjectId,
    ref: 'Playlist'
  }],
  watchHistory: [{
    video: {
      type: Schema.Types.ObjectId,
      ref: 'Video'
    },
    watchedAt: {
      type: Date,
      default: Date.now
    },
    progress: {
      type: Number,
      default: 0 // Progress in seconds
    }
  }],
  likedVideos: [{
    type: Schema.Types.ObjectId,
    ref: 'Video'
  }],
  savedVideos: [{
    type: Schema.Types.ObjectId,
    ref: 'Video'
  }],
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  channelCreatedAt: {
    type: Date,
    default: Date.now
  },
  totalViews: {
    type: Number,
    default: 0
  }

},{
    timestamps:true
})

module.exports = mongoose.model('User', userSchema);

