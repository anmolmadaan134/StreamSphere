const Video = require('../models/Video');
const { videoQueue } = require('../queues/videoQueue');
const {uploadToCloudinary,generateThumbnail} = require('../utils/cloudinaryUpload')
const cloudinary = require('cloudinary').v2;
const path = require('path')


require('dotenv').config();
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

//Upload Video

exports.uploadVideo = async(req,res)=>{
    try{

        
        
        const {title,description,tags,privacy='public'} = req.body;
        const file= req.file

        if(!file){
            return res.status(400).json({
                success:false,
                message:'No Video file uploaded'
            })
        }

        // Normalize the file path
        const normalizedFilePath = path.normalize(file.path);
        console.log("Normalized File path:", normalizedFilePath);



        console.log("File path:", file.path);
  

        //Upload to cloudinary
        const uploadResult = await uploadToCloudinary(normalizedFilePath,'videos');

        //Generate Thumbnail
        const thumbnailUrl = await generateThumbnail(uploadResult.publicId)

        //Create video document
        const newVideo = new Video({
            title,
            description,
            url:uploadResult.url,
            thumbnailUrl,
            publicId:uploadResult.publicId,
            owner:req.user._id,
            duration:uploadResult.duration,
            tags:tags?tags.split(',').map(tag=>tag.trim()):[],
            format:uploadResult.format,
            metadata:{
                resolution:{
                    width:uploadResult.width,
                    height:uploadResult.height
                },
                fileSize:uploadResult.bytes
            },
             privacy: privacy || 'public',
        processingStatus: 'pending'
            
        })

        //Save video to database
        const savedVideo = await newVideo.save()

        //Add to processing queue
        const outputDir = path.join(__dirname,'../processed-videos')
        
        videoQueue.add({
            videoId:savedVideo._id,
            inputPath:normalizedFilePath
        })

        res.status(201).json({
            success:true,
            data:savedVideo
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

//Get user videos

exports.getUserVideos = async(req,res)=>{
    try{
        const videos = await Video.find({owner:req.user._id})
        .sort({createdAt:-1});

        res.status(200).json({
            success:true,
            data:videos
        })
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

//Get Video 

exports.getVideo = async(req, res) => {
    try {
        const videoId = req.params.id;
        const video = await Video.findById(videoId);
        
        if (!video) {
            return res.status(404).json({
                success: false,
                message: 'Video not found'
            });
        }
        
        // Check if user has access to this video
        if (video.privacy === 'private' && video.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to access this video'
            });
        }
        
        res.status(200).json({
            success: true,
            data: video
        });
    } catch(error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//List videos
exports.listVideos = async(req,res)=>{
    try{
        const{
            page=1,
            limit=10,
            sort='createdAt',
            order='desc',
            privacy='public'
        } = req.query;

        const sortOptions = {[sort]:order === 'desc'?-1:1};

        const videos = await Video.find({privacy})
        .sort(sortOptions)
        .limit(limit*10)
        .skip((page-1)*limit)
        .populate('owner','username')

        const total = Video.countDocuments({privacy})

        res.status(200).json({
            videos,
            totalPages: Math.ceil(total / limit),
            currentPage: page
          });
    }catch (error) {
        res.status(500).json({ 
          message: 'Error listing videos', 
          error: error.message 
        });
      }
}

// Update video details

exports.updateVideo = async(req,res)=>{
    try{

        const {id} = req.params;
        const {title,description,tags,privacy} = req.body;

        

        const video = await Video.findById(id);
        
        if(!video){
            return res.status(404).json({message:"Video not found"});
        }

        //Checking if user is the owner
        if(video.owner.toString()!==req.user._id.toString()){
            return res.status(403).json({message:'Unauthorized to update this video'});
        }

        //Updating video details
        video.title = title||video.title
        video.description = description||video.description
        video.tags = tags?tags.split(',').map(tag=>tag.trim()):video.tags
        video.privacy = privacy || video.privacy

        const savedVideo = await video.save();

        res.status(200).json({
            message:"Video updated successfully",
            savedVideo
        })

    }catch (error) {
        res.status(500).json({ 
          message: 'Error updating video', 
          error: error.message 
        });
      }
}

//Delete Video

exports.deleteVideo = async(req,res)=>{
    try{
        const {id} = req.params

        console.log('Deleting Video - ID:', id);
        console.log('User ID:', req.user._id);
        const video = await Video.findById(id);

        if(!video){
            return res.status(404).json({message:"Video not found"});
        }

        if(video.owner.toString()!==req.user._id.toString()){
            return res.status(403).json({message:'Unauthorized to delete this video'});
        }

        //Delete from cloudinary
        await cloudinary.uploader.destroy(video.publicId,{resource_type:'video'})

        //Delete video document
        await Video.findByIdAndDelete(id);

        res.status(200).json({
            message:"Video deleted successfully"
        })
    }catch (error) {
        res.status(500).json({ 
          message: 'Error deleting video', 
          error: error.message 
        });
      }
}

exports.getVideoStatus = async(req,res)=>{
    try{
        const videoId = req.params.id
        const video = await Video.findById(videoId);

        if(!video){
            return res.status(404).json({
                success:false,
                message:'Video not found'
            })
        }

        //Check if user has access to the video

        if(video.privacy === 'private' && video.owner.toString()!==req.user._id.toString()){
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to access this video'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                videoId: video._id,
                title: video.title,
                processingStatus: video.processingStatus,
                processingError: video.processingError,
                availableResolutions: video.resolutions.map(res => ({
                    resolution: res.resolution,
                    url: res.url
                }))
            }
        });
    }catch(error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Like a video
exports.likeVideo = async (req, res) => {
    try {
      const { videoId } = req.params;
      const userId = req.user.id;
      
      const video = await Video.findById(videoId);
      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }
      
      // Check if already liked
      if (video.likes.includes(userId)) {
        // Unlike if already liked
        video.likes = video.likes.filter(
          like => like.toString() !== userId
        );
        await video.save();
        
        return res.json({
          likes: video.likes.length,
          dislikes: video.dislikes.length,
          liked: false,
          disliked: false
        });
      }
      
      // Remove from dislikes if present
      if (video.dislikes.includes(userId)) {
        video.dislikes = video.dislikes.filter(
          dislike => dislike.toString() !== userId
        );
      }
      
      // Add to likes
      video.likes.push(userId);
      await video.save();
      
      res.json({
        likes: video.likes.length,
        dislikes: video.dislikes.length,
        liked: true,
        disliked: false
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };
  
  // Dislike a video
  exports.dislikeVideo = async (req, res) => {
    try {
      const { videoId } = req.params;
      const userId = req.user.id;
      
      const video = await Video.findById(videoId);
      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }
      
      // Check if already disliked
      if (video.dislikes.includes(userId)) {
        // Remove dislike if already disliked
        video.dislikes = video.dislikes.filter(
          dislike => dislike.toString() !== userId
        );
        await video.save();
        
        return res.json({
          likes: video.likes.length,
          dislikes: video.dislikes.length,
          liked: false,
          disliked: false
        });
      }
      
      // Remove from likes if present
      if (video.likes.includes(userId)) {
        video.likes = video.likes.filter(
          like => like.toString() !== userId
        );
      }
      
      // Add to dislikes
      video.dislikes.push(userId);
      await video.save();
      
      res.json({
        likes: video.likes.length,
        dislikes: video.dislikes.length,
        liked: false,
        disliked: true
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };
  
  // routes/videos.js - Add these routes
  /*
  // @route   PUT /api/videos/like/:videoId
  // @desc    Like a video
  // @access  Private
  router.put('/like/:videoId', auth, videoController.likeVideo);
  
  // @route   PUT /api/videos/dislike/:videoId
  // @desc    Dislike a video
  // @access  Private
  router.put('/dislike/:videoId', auth, videoController.dislikeVideo);
  */
  