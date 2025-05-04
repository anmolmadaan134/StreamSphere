const {validationResult} = require('express-validator');
const Comment = require('../models/Comment');


// Create a comment
exports.createComment = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    try {
      const { content, videoId, parentCommentId } = req.body;
      
      // Check if video exists
      const video = await Video.findById(videoId);
      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }
      
      // Create comment object
      const commentFields = {
        content,
        user: req.user.id,
        video: videoId
      };
      
      // If this is a reply to another comment
      if (parentCommentId) {
        const parentComment = await Comment.findById(parentCommentId);
        if (!parentComment) {
          return res.status(404).json({ message: 'Parent comment not found' });
        }
        commentFields.parentComment = parentCommentId;
      }
      
      const comment = new Comment(commentFields);
      await comment.save();
      
      // If it's a reply, add it to the parent comment's replies array
      if (parentCommentId) {
        await Comment.findByIdAndUpdate(
          parentCommentId,
          { $push: { replies: comment._id } }
        );
      }
     // Populate user data
     const populatedComment = await Comment.findById(comment._id)
     .populate('user', 'name username avatar');
   
   res.json(populatedComment);
 } catch (err) {
   console.error(err.message);
   res.status(500).send('Server Error');
 }
};  

//Get Comments for video
exports.getVideoComments = async(req,res)=>{
  try{

    const {videoId} = req.params;

    //Get top level comments

    const comments = await Comment.find({
      video:videoId,
      parentComment:null
    })
    .populate('user','name username avatar')
    .sort({createdAt:-1})

    //For each comment, get its replies
    const commentsWithReplies = await Promise.all(comments.map(async (comment) => {
      const commentObj = comment.toObject();
      
      if (comment.replies.length > 0) {
        commentObj.replies = await Comment.find({
          _id: { $in: comment.replies }
        })
        .populate('user', 'name username avatar')
        .sort({ createdAt: 1 });
      }
      
      return commentObj;
    }));
    
    res.json(commentsWithReplies);
  }catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}