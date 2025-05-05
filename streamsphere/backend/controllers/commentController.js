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


// Like a comment
exports.likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;
    
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if already liked
    if (comment.likes.includes(userId)) {
      return res.status(400).json({ message: 'Comment already liked' });
    }
    
    // Remove from dislikes if present
    if (comment.dislikes.includes(userId)) {
      comment.dislikes = comment.dislikes.filter(
        dislike => dislike.toString() !== userId
      );
    }
    
    // Add to likes
    comment.likes.push(userId);
    await comment.save();
    
    res.json({
      likes: comment.likes.length,
      dislikes: comment.dislikes.length,
      liked: true,
      disliked: false
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Dislike a comment
exports.dislikeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;
    
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if already disliked
    if (comment.dislikes.includes(userId)) {
      return res.status(400).json({ message: 'Comment already disliked' });
    }
    
    // Remove from likes if present
    if (comment.likes.includes(userId)) {
      comment.likes = comment.likes.filter(
        like => like.toString() !== userId
      );
    }
    
    // Add to dislikes
    comment.dislikes.push(userId);
    await comment.save();
    
    res.json({
      likes: comment.likes.length,
      dislikes: comment.dislikes.length,
      liked: false,
      disliked: true
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
